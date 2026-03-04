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
} from "../types/ast.ts";
import { VariableActions } from "./VariableActions.ts";
import { Calculate } from "../logic/expressionCount.ts";

export class Interpreter {
  private variableData = new VariableActions();
  private blockData: ProgramNode;
  readonly startNode: StatementNode | undefined;

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
      throw new Error("The starting node does not point anywhere.");
    }

    yield* this.action(currentNode);

    return { time: (Date.now() - timeStart) / 1000 };
  }

  private actionsNode(node: StatementNode) {
    switch (node.type) {
      case "Assignment":
        this.assignment(node);
        break;
      case "VariableDeclaration":
        this.declaration(node);
        break;
      case "getSize":
        this.getSize(node);
        break;
    }
  }

  private assignment(node: AssignmentNode): void {
    if (node.target.type === "MemberExpression") {
      const index = node.target.index;
      const name =
        node.target.object.type === "Identifier" ? node.target.object.name : "";

      this.variableData.changeVariable(name, node.value, index);
      return;
    }

    if (node.target.type === "Identifier") {
      this.variableData.changeVariable(node.target.name, node.value);
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
    this.variableData.newScope();

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
      Calculate(node.from.right, this.variableData),
    );

    let condition = Calculate(node.to, this.variableData);

    if (condition.type !== "Boolean") {
      throw new Error("Condition must be a boolean");
    }

    yield {
      type: node.type,
      id: node.id,
      variableAll: this.variableData.getAll(),
    };

    while (condition.value) {
      if (node.bodyId) {
        const currentNode = this.nodeMap.get(node.bodyId);

        if (currentNode) {
          const res = yield* this.action(currentNode);
          if (res === "Break") {
            break;
          }
        }
      }

      const value = Calculate(node.iterator, this.variableData);
      this.variableData.changeVariable(nameIterator, value);

      condition = Calculate(node.to, this.variableData);
      if (condition.type !== "Boolean") {
        throw new Error("Condition must be a boolean");
      }
    }

    this.variableData.deleteScope();
  }

  private *whileNode(node: WhileNode) {
    this.variableData.newScope();
    let condition = Calculate(node.condition, this.variableData).value;

    yield {
      type: node.type,
      id: node.id,
      variableAll: this.variableData.getAll(),
    };

    while (condition) {
      if (node.bodyId) {
        const currentNode = this.nodeMap.get(node.bodyId);
        if (currentNode) {
          const result = yield* this.action(currentNode);
          if (result === "Break") {
            break;
          }
        }
      }
      condition = Calculate(node.condition, this.variableData).value;
    }
    this.variableData.deleteScope();
  }

  private *action(
    startNode: StatementNode,
  ): Generator<DataForDebug, "Break" | void, void> {
    let currentNode: StatementNode | undefined = startNode;
    try {
      while (currentNode) {
        if (currentNode.type === "BreakNode") {
          return "Break";
        }
        if (currentNode.type === "For") {
          yield* this.forNode(currentNode);

          currentNode = this.getNext(currentNode);
          continue;
        }

        if (currentNode.type === "If") {
          const result = yield* this.ifNode(currentNode);
          if (result === "Break") {
            return "Break";
          }

          currentNode = this.getNext(currentNode);
          continue;
        }

        if (currentNode.type === "While") {
          if (Calculate(currentNode.condition, this.variableData)) {
            yield* this.whileNode(currentNode);
          }

          currentNode = this.getNext(currentNode);
          continue;
        }

        this.actionsNode(currentNode);

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
                : Calculate(currentNode.expression, this.variableData)
              : undefined,
        };

        currentNode = this.getNext(currentNode);
      }
    } catch (e) {
      throw new Error(e.message, { cause: { BlockId: currentNode?.id } });
    }
  }

  private *ifNode(node: IfNode): Generator<DataForDebug, "Break" | void, void> {
    this.variableData.newScope();
    let result: "Break" | void;

    const trueId = node.trueId;
    const falseId = node.falseId;
    const condition = Calculate(
      node.condition,
      this.variableData,
    ) as BooleanNode;

    yield {
      type: node.type,
      id: node.id,
      variableAll: this.variableData.getAll(),
    };

    if (condition.value) {
      if (trueId) {
        const nextActions = this.nodeMap.get(trueId);
        if (nextActions) {
          result = yield* this.action(nextActions);
        }
      }
    } else {
      if (falseId) {
        const nextActions = this.nodeMap.get(falseId);
        if (nextActions) {
          result = yield* this.action(nextActions);
        }
      }
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
}
