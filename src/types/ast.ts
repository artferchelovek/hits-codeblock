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
  | GetSizeNode
  | FunctionDeclarationNode
  | CallNode
  | ReturnNode;

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
  size?: ExpressionNode;
}

export interface AssignmentNode extends BaseNodeAttributes {
  type: "Assignment";
  target: ExpressionNode;
  value: ExpressionNode;
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

export interface FunctionDeclarationNode extends BaseNodeAttributes {
  type: "FunctionDeclaration";
  name: string;
  params: string[];
}

export interface CallNode extends BaseNodeAttributes {
  type: "Call";
  callee: string;
  args: ExpressionNode[];
}

export interface ReturnNode extends BaseNodeAttributes {
  type: "Return";
  argument: ExpressionNode | null;
}

export type ExpressionNode =
  | LiteralNode
  | IdentifierNode
  | StringNode
  | BinaryExpressionNode
  | ArrayNode
  | MemberExpressionNode
  | BooleanNode
  | UnaryExpression
  | CallExpressionNode;

export interface LiteralNode {
  type: "Literal";
  value: number;
}

export interface UnaryExpression {
  type: "UnaryExpression";
  operator: "-";
  value: ExpressionNode;
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

export interface CallExpressionNode {
  type: "CallExpression";
  callee: string;
  args: ExpressionNode[];
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
    | "="
    | "&&"
    | "||";
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface VariableForDebug {
  type: "VariableForDebug";
  name: string;
  value: ExpressionNode;
}

export interface GetSizeNode extends BaseNodeAttributes {
  type: "getSize";
  target: ExpressionNode;
  object: ExpressionNode;
}

export interface DataForDebug {
  type: typesForDebug;
  id: string;
  variableAll: VariableForDebug[];
  print?: ExpressionNode;
  time?: number;
}

export type typesForDebug = StatementNode["type"];
