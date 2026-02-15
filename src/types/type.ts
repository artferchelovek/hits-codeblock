export type BlockId =
  | `assign_${number}`
  | `if_${number}`
  | `declaring_${number}`
  | `print_${number}`
  | `root`;

export type BlockType =
  | "start"
  | "end"
  | "assignment"
  | "declaring_variable"
  | "print"
  | "if_block";

export type Operator = "!=" | "==" | ">" | ">=" | "<=" | "<";

export type Expression =
  | number
  | string
  | boolean
  | {
      left: Expression;
      operation: "+" | "-" | "/" | "%" | "*";
      right: Expression;
    };

export type Condition = {
  left: Expression;
  operator: Operator;
  right: Expression;
};

export interface BlockBase {
  type: BlockType;
  id: BlockId | null;
  next_id: BlockId | null;
}

export interface IfBlock extends BlockBase {
  type: "if_block";
  condition: Condition;
  then_block: Block[] | null;
  else_block: Block[] | null;
}

export interface DeclaringVariable extends BlockBase {
  type: "declaring_variable";
  name: string[];
}

export interface Assignment extends BlockBase {
  type: "assignment";
  name: string;
  value: Expression;
}

export interface Print extends BlockBase {
  type: "print";
  name: Expression;
}

export interface EndBlock {
  type: "end";
  next_id: BlockId | null;
}

export interface Block {
  category: Print | Assignment | DeclaringVariable | IfBlock | EndBlock;
}
