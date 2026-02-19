export interface ProgramNode {
  type: "Program";
  body: StatementNode[];
}

export type StatementNode =
  | VariableDeclarationNode
  | AssignmentNode
  | ForNode
  | IfNode
  | PrintNode;

export interface VariableDeclarationNode {
  id: string;
  type: "VariableDeclaration";
  name: string;
  x: number;
  y: number;
  // value: ExpressionNode | null;
}

export interface AssignmentNode {
  id: string;
  type: "Assignment";
  target: string; // ima peremennoi
  value: ExpressionNode;
  x: number;
  y: number;
}

export interface ForNode {
  id: string;
  type: "For";
  iterator: string;
  from: ExpressionNode;
  to: ExpressionNode;
  body: StatementNode[];
  x: number;
  y: number;
}

export interface IfNode {
  id: string;
  type: "If";
  condition: ExpressionNode;
  body: StatementNode[];
  x: number;
  y: number;
}

export interface PrintNode {
  id: string;
  type: "Print";
  expression: ExpressionNode;
  x: number;
  y: number;
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
