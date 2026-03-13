import type { ProgramNode } from "../types/ast.ts";

export const uploadProgram = (file: File): Promise<ProgramNode> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json: ProgramNode = JSON.parse(event.target?.result as string);
        if (json.type && json.body) {
          resolve(json);
        }
        reject("Невозможно запустить пустой файл");
      } catch (e) {
        reject(e);
      }
    };

    reader.onerror = () => reject(new Error("Ошибка чтения файла"));

    reader.readAsText(file);
  });
};
