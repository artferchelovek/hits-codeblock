export interface ProgramNode {
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
  | IfNode
  | PrintNode;

export interface VariableDeclarationNode extends BaseNodeAttributes {
  type: "VariableDeclaration";
  name: string;
}

export interface AssignmentNode extends BaseNodeAttributes {
  type: "Assignment";
  target: string; // ima peremennoi
  value: ExpressionNode;
}

export interface ForNode extends BaseNodeAttributes {
  type: "For";
  iterator: string;
  from: ExpressionNode;
  to: ExpressionNode;
  body: StatementNode[];
}

export interface IfNode extends BaseNodeAttributes {
  type: "If";
  condition: ExpressionNode;
  body: StatementNode[];
}

export interface PrintNode extends BaseNodeAttributes {
  type: "Print";
  expression: ExpressionNode;
}

export type ExpressionNode =
  | LiteralNode
  | IdentifierNode
  | BinaryExpressionNode;

export interface LiteralNode {
  type: "Literal";
  value: number;
}

export interface IdentifierNode {
  type: "Identifier";
  name: string;
}

export interface BinaryExpressionNode {
  type: "BinaryExpression";
  operator: "+" | "-" | "*" | "/" | "%" | ">" | "<" | ">=" | "<=" | "==";
  left: ExpressionNode;
  right: ExpressionNode;
}
