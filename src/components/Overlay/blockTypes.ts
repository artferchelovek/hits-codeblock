export interface IBlock {
  name: string;
  type:
    | "declaring_variable"
    | "assignment"
    | "expression"
    | "condition"
    | "print";
}

export const blockTypes: IBlock[] = [
  {
    name: "Объявить переменную",
    type: "declaring_variable",
  },
  {
    name: "Присвоить значение",
    type: "assignment",
  },
  {
    name: "Вычислить",
    type: "expression",
  },
  {
    name: "Условие",
    type: "condition",
  },
  {
    name: "Вывести",
    type: "print",
  },
];
