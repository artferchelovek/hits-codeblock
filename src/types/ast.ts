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
  value: ExpressionNode | null;
}

export interface AssignmentNode {
  id: string;
  type: "Assignment";
  target: string; // ima peremennoi
  value: ExpressionNode;
}

export interface ForNode {
  id: string;
  type: "For";
  iterator: string;
  from: ExpressionNode;
  to: ExpressionNode;
  body: StatementNode[];
}

export interface IfNode {
  id: string;
  type: "If";
  condition: ExpressionNode;
  body: StatementNode[];
}

export interface PrintNode {
  id: string;
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
  operator: "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==";
  left: ExpressionNode;
  right: ExpressionNode;
}
