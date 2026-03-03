export interface ProgramNode {
  name: string;
  type: "Program";
  body: StatementNode[];
}

export interface BaseNodeAttributes {
  id: string;
  x: number;
  y: number;
  nextId: string | null;
}

export type StatementNode =
  | VariableDeclarationNode
  | AssignmentNode
  | ForNode
  | WhileNode
  | IfNode
  | PrintNode
  | StartNode
  | BreakNode
  | getSize;

export interface StartNode extends BaseNodeAttributes {
  type: "StartNode";
  nextId: string | null;
}

export interface BreakNode extends BaseNodeAttributes {
  type: "BreakNode";
  nextId: string | null;
}

export interface VariableDeclarationNode extends BaseNodeAttributes {
  type: "VariableDeclaration";
  name: string;
}

export interface AssignmentNode extends BaseNodeAttributes {
  type: "Assignment";
  target: IdentifierNode | MemberExpressionNode;
  value: ExpressionNode;
  size?: LiteralNode | BinaryExpressionNode;
}

export interface ForNode extends BaseNodeAttributes {
  type: "For";
  iterator: ExpressionNode;
  from: ExpressionNode;
  to: ExpressionNode;
  bodyId: string | null;
}

export interface WhileNode extends BaseNodeAttributes {
  type: "While";
  condition: BinaryExpressionNode;
  bodyId: string | null;
}

export interface IfNode extends BaseNodeAttributes {
  type: "If";
  condition: BinaryExpressionNode;
  trueId: string | null;
  falseId: string | null;
}

export interface PrintNode extends BaseNodeAttributes {
  type: "Print";
  expression: ExpressionNode;
}

export type ExpressionNode =
  | LiteralNode
  | IdentifierNode
  | StringNode
  | BinaryExpressionNode
  | ArrayNode
  | MemberExpressionNode
  | BooleanNode;

export interface LiteralNode {
  type: "Literal";
  value: number;
}

export interface ArrayNode {
  type: "Array";
  value: ExpressionNode[];
}

export interface MemberExpressionNode {
  type: "MemberExpression";
  object: ExpressionNode;
  index: ExpressionNode;
}

export interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export interface StringNode {
  type: "String";
  value: string;
}

export interface BooleanNode {
  type: "Boolean";
  value: boolean;
}

export interface BinaryExpressionNode {
  type: "BinaryExpression";
  operator:
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | ">"
    | "<"
    | ">="
    | "<="
    | "=="
    | "!="
    | "=";
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface VariableForDebug {
  type: "VariableForDebug";
  name: string;
  value: ExpressionNode;
}

export interface getSize extends BaseNodeAttributes {
  type: "getSize";
  target: IdentifierNode;
  object: ExpressionNode;
}

export interface Errors {
  type: Error;
  message: string;
  BlockId?: string;
}

type Error = "not_found";
