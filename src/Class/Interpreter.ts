import type {
  AssignmentNode,
  BooleanNode,
  ForNode,
  IfNode,
  ProgramNode,
  StatementNode,
  VariableDeclarationNode,
  WhileNode,
  DataForDebug,
  GetSizeNode,
  FunctionDeclarationNode,
  CallNode,
  CallExpressionNode,
  ReturnNode,
  ExpressionNode,
  LiteralNode,
  StringNode,
  ArrayNode,
} from "../types/ast.ts";
import { VariableActions } from "./VariableActions.ts";
import { Calculate } from "../logic/expressionCount.ts";
import { parseNameAndSize } from "../logic/expression.ts";

export class Interpreter {
  private variableData = new VariableActions();
  private blockData: ProgramNode;
  readonly startNode: StatementNode | undefined;
  private functionData = new Map<string, FunctionDeclarationNode>();

  private nodeMap: Map<string, StatementNode> = new Map<
    string,
    StatementNode
  >();

  public constructor(blocks: ProgramNode) {
    this.blockData = blocks;
    this.nodeMap = new Map(this.blockData.body.map((node) => [node.id, node]));
    this.startNode = this.blockData.body.find((i) => i.type === "StartNode");
  }

  public *interpreter() {
    const timeStart = new Date().getTime();
    if (!this.startNode || !this.startNode.nextId) {
      throw new Error("The starting node was not found");
    }

    const currentNode = this.nodeMap.get(this.startNode.nextId);

    if (currentNode === undefined) {
      throw new Error("The start node is null", {
        cause: { BlockId: this.startNode.id },
      });
    }

    for (const block of this.blockData.body) {
      if (block.type === "FunctionDeclaration") {
        if (
          block.params.find(
            (item) =>
              !/^[a-zA-Zа-яА-Я_][a-zA-Zа-яА-Я0-9_]*(\(\d*\))?$/.test(item),
          )
        ) {
          throw new Error(`Invalid function argument name`, {
            cause: { BlockId: block.id },
          });
        }
        if (block.nextId === null) {
          throw new Error("Empty function", { cause: { BlockId: block.id } });
        }

        this.functionData.set(block.name, block);
      }
    }

    yield* this.action(currentNode);

    return { time: (Date.now() - timeStart) / 1000 };
  }

  private *assignment(node: AssignmentNode) {
    const value = yield* this.calculate(node.value);
    if (node.target.type === "MemberExpression") {
      const index = yield* this.calculate(node.target.index);
      const name =
        node.target.object.type === "Identifier" ? node.target.object.name : "";

      if (index.type === "Literal") {
        this.variableData.changeVariable(name, value, index);
        return;
      } else {
        throw new Error("Index must be a Literal", {
          cause: { BlockId: node.id },
        });
      }
    }

    if (node.target.type === "Identifier") {
      this.variableData.changeVariable(node.target.name, value);
    } else {
      throw new Error("Unsuitable type for assignment");
    }
  }

  private declaration(node: VariableDeclarationNode): void {
    const names = node.name.split(",").map((item) => item.trim());

    if (node.size) {
      this.variableData.declareVariable(names[0], node.size);
      return;
    }

    for (const name of names) {
      this.variableData.declareVariable(name);
    }
  }

  private *forNode(node: ForNode) {
    if (node.iterator.type !== "BinaryExpression") {
      throw new Error("Iterator should be a BinaryExpression");
    }

    if (
      node.from.type !== "BinaryExpression" ||
      node.from.left.type !== "Identifier"
    ) {
      throw new Error("Need declare variable ");
    }

    const nameIterator = node.from.left.name;

    this.variableData.declareVariable(nameIterator);

    this.variableData.changeVariable(
      nameIterator,

      yield* this.calculate(node.from.right),
    );

    let condition = yield* this.calculate(node.to);

    if (condition.type !== "Boolean") {
      throw new Error("Condition must be a boolean");
    }

    yield {
      type: node.type,

      id: node.id,

      variableAll: this.variableData.getAll(),
    };

    while (condition.value) {
      this.variableData.newScope();

      if (node.bodyId) {
        const currentNode = this.nodeMap.get(node.bodyId);

        try {
          if (currentNode) {
            const res = yield* this.action(currentNode);

            if (res === "Break") {
              break;
            }

            if (res && res.type === "Return") {
              return res;
            }
          }
        } catch (e) {
          this.checkError(e, currentNode);
        }
      }

      this.variableData.deleteScope();

      const value = yield* this.calculate(node.iterator);

      this.variableData.changeVariable(nameIterator, value);

      condition = yield* this.calculate(node.to);

      if (condition.type !== "Boolean") {
        throw new Error("Condition must be a boolean");
      }
    }

    this.variableData.deleteVariable(nameIterator);
  }

  private *whileNode(node: WhileNode) {
    let conditionRet = yield* this.calculate(node.condition);
    let condition;
    if ("value" in conditionRet) {
      condition = conditionRet.value;
    }

    yield {
      type: node.type,
      id: node.id,
      variableAll: this.variableData.getAll(),
    };

    while (condition) {
      this.variableData.newScope();
      if (node.bodyId) {
        const currentNode = this.nodeMap.get(node.bodyId);
        try {
          if (currentNode) {
            const result = yield* this.action(currentNode);
            if (result === "Break") {
              break;
            }
            if (result && result.type === "Return") {
              return result;
            }
          }
        } catch (e) {
          this.checkError(e, currentNode);
        }
      }
      conditionRet = yield* this.calculate(node.condition);
      if ("value" in conditionRet) {
        condition = conditionRet.value;
      }
      this.variableData.deleteScope();
    }
  }

  private *action(
    startNode: StatementNode,
  ): Generator<DataForDebug, "Break" | ReturnNode | void, void> {
    let currentNode: StatementNode | undefined = startNode;
    try {
      let result;
      while (currentNode) {
        switch (currentNode.type) {
          case "If":
            result = yield* this.ifNode(currentNode);
            break;

          case "While":
            result = yield* this.whileNode(currentNode);
            break;

          case "Call":
            yield* this.callNodeAction(currentNode);
            break;

          case "For":
            result = yield* this.forNode(currentNode);
            break;

          case "Assignment":
            yield* this.assignment(currentNode);
            break;

          case "VariableDeclaration":
            this.declaration(currentNode);
            break;

          case "getSize":
            this.getSize(currentNode);
            break;

          case "Return":
            yield {
              type: currentNode.type,
              id: currentNode.id,
              variableAll: this.variableData.getAll(),
            };
            return currentNode;

          case "BreakNode":
            return "Break";
        }

        yield {
          type: currentNode.type,
          id: currentNode.id,
          variableAll: this.variableData.getAll(),
          print:
            currentNode.type === "Print"
              ? currentNode.expression.type === "Identifier"
                ? this.variableData.getVariableByName(
                    currentNode.expression.name,
                  )
                : yield* this.calculate(currentNode.expression)
              : undefined,
        };
        if (result === "Break") {
          return "Break";
        } else if (result && result.type === "Return") {
          return result;
        }
        currentNode = this.getNext(currentNode);
      }
    } catch (e) {
      this.checkError(e, currentNode);
    }
  }

  private *ifNode(
    node: IfNode,
  ): Generator<DataForDebug, "Break" | ReturnNode | void, void> {
    this.variableData.newScope();
    let result;
    let nextActions;
    const trueId = node.trueId;
    const falseId = node.falseId;

    const condition = yield* this.calculate(node.condition);

    yield {
      type: node.type,
      id: node.id,
      variableAll: this.variableData.getAll(),
    };

    if (condition.value) {
      if (trueId) {
        nextActions = this.nodeMap.get(trueId);
      }
    } else {
      if (falseId) {
        nextActions = this.nodeMap.get(falseId);
      }
    }

    if (nextActions) {
      result = yield* this.action(nextActions);
    }

    this.variableData.deleteScope();
    return result;
  }

  private getSize(node: GetSizeNode): void {
    if (node.target.type !== "Identifier") {
      throw new Error("Object is missing");
    }

    let arrayVariable = node.object;
    const variableForSave = node.target;

    if (arrayVariable.type === "Identifier") {
      arrayVariable = this.variableData.getVariableByName(arrayVariable.name);
    }

    if (arrayVariable.type === "Array" || arrayVariable.type === "String") {
      this.variableData.changeVariable(variableForSave.name, {
        type: "Literal",
        value: arrayVariable.value.length,
      });
      return;
    }

    throw new Error(`Cannot get size of ${arrayVariable.type}`);
  }

  private getNext(node: StatementNode): StatementNode | undefined {
    return node.nextId ? this.nodeMap.get(node.nextId) : undefined;
  }

  private checkError(error: unknown, node?: StatementNode) {
    if (!node?.id) {
      throw error;
    }

    if (error instanceof Error) {
      if (
        error.cause &&
        typeof error.cause === "object" &&
        "BlockId" in error.cause
      ) {
        throw error;
      }
      throw new Error(error.message, { cause: { BlockId: node.id } });
    }
  }

  public *callNodeAction(node: CallNode | CallExpressionNode) {
    const currentFunction = this.correctCallFunction(
      node,
    ) as FunctionDeclarationNode;

    yield {
      type: currentFunction.type,
      id: currentFunction.id,
      variableAll: this.variableData.getAll(),
    };

    this.variableData.newScope();

    for (let i = 0; i < node.args.length; i++) {
      const arg = parseNameAndSize(currentFunction.params[i]);
      const inputArg = node.args[i];
      const value =
        inputArg.type === "Identifier"
          ? this.variableData.getVariableByName(inputArg.name)
          : Calculate(inputArg, this.variableData);

      if (value.type === "Array") {
        const size: LiteralNode = {
          type: "Literal",
          value: value.value.length,
        };
        this.variableData.declareVariable(arg.name, size);
      } else {
        this.variableData.declareVariable(arg.name);
      }

      this.variableData.changeVariable(arg.name, value);
    }

    try {
      const startFunc = this.nodeMap.get(currentFunction.nextId as string);
      if (startFunc) {
        const res = yield* this.action(startFunc);
        if (res && res !== "Break" && res.argument) {
          return yield* this.calculate(res.argument);
        }
      }
    } finally {
      this.variableData.deleteScope();
    }
  }

  private correctCallFunction(node: CallNode | CallExpressionNode) {
    const currentFunction = this.functionData.get(node.callee);

    if (currentFunction === undefined) {
      this.checkError(
        new Error(`Cannot call function: ${node.callee}`),
        currentFunction,
      );
      return;
    }
    if (currentFunction.nextId === null) {
      this.checkError(
        new Error(`Cannot call empty function: ${node.callee}`),
        currentFunction,
      );
      return;
    }

    if (currentFunction.params.length < node.args.length) {
      this.checkError(
        new Error(
          `${currentFunction.name} takes 
          ${currentFunction.params.length} arguments but 
          ${node.args.length} were given`,
        ),
        currentFunction,
      );
      return;
    }

    if (currentFunction.params.length > node.args.length) {
      const missingArg = currentFunction.params.slice(node.args.length);
      this.checkError(
        new Error(
          `"${currentFunction.name}" missing ${missingArg.length} argument ${missingArg.toString()}`,
        ),
        currentFunction,
      );
    }
    return currentFunction;
  }

  public *callExpression(node: CallExpressionNode) {
    const currentFunction = this.functionData.get(node.callee);
    if (currentFunction === undefined) {
      return;
    }

    const result = yield* this.callNodeAction(node);

    if (result !== undefined) {
      return result;
    }

    throw new Error("Function does not have return a value", {
      cause: { BlockId: currentFunction.id },
    });
  }

  private *checkNodeFunction(
    node: ExpressionNode,
  ): Generator<DataForDebug, ExpressionNode, void> {
    if (node.type === "CallExpression") {
      const res = yield* this.callExpression(node);
      if (res) {
        return res;
      }
    }
    if (node.type === "Array") {
      const newArray: ExpressionNode[] = [];
      for (const item of node.value) {
        newArray.push(yield* this.checkNodeFunction(item));
      }
      return { ...node, value: newArray };
    }

    if (node.type === "BinaryExpression") {
      return {
        ...node,
        left: yield* this.checkNodeFunction(node.left),
        right: yield* this.checkNodeFunction(node.right),
      };
    }

    if (node.type === "MemberExpression") {
      return {
        ...node,
        index: yield* this.checkNodeFunction(node.index),
      };
    }

    return node;
  }

  private *calculate(
    node: ExpressionNode,
  ): Generator<
    DataForDebug,
    LiteralNode | BooleanNode | StringNode | ArrayNode,
    void
  > {
    const updateNode = yield* this.checkNodeFunction(node);

    if (updateNode.type === "Array") {
      const array: ExpressionNode[] = [];
      for (const nodes of updateNode.value) {
        const elem = yield* this.calculate(nodes);

        if (nodes.type !== "Array") {
          array.push(elem);
        }
      }
      return { type: "Array", value: array };
    }

    if (updateNode.type === "Identifier") {
      const value = this.variableData.getVariableByName(updateNode.name);
      if ("value" in value && value.type !== "UnaryExpression") {
        return value;
      }
    }

    return Calculate(updateNode, this.variableData);
  }
}
