import type { ForNode } from "../../../types/ast.ts";
import TripleBlockLayout from "./TripleBlockLayout.tsx";
import { useEffect, useState } from "react";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";
import { useProgramContext } from "../../../context/ProgramContext.tsx";

export default function For({ node }: { node: ForNode }) {
  const { updateStatement } = useProgramContext();

  const [iterator, setIterator] = useState(renderExpression(node.iterator));
  const [from, setFrom] = useState(renderExpression(node.from));
  const [to, setTo] = useState(renderExpression(node.to));

  useEffect(() => {
    setIterator(renderExpression(node.iterator));
  }, [node.iterator]);
  useEffect(() => {
    setFrom(renderExpression(node.from));
  }, [node.from]);
  useEffect(() => {
    setTo(renderExpression(node.to));
  }, [node.to]);

  return (
    <TripleBlockLayout node={node}>
      <input
        value={from}
        onChange={(e) => {
          const value = e.target.value;
          setFrom(value);
          try {
            const parsed = stringToExpression(value);

            updateStatement(node.id, (n) => {
              if (n.type !== "For") return n;

              return {
                ...n,
                from: parsed,
              };
            });
          } catch {}
        }}
        type="text"
      />
      <p>:</p>
      <input
        value={to}
        onChange={(e) => {
          const value = e.target.value;
          setTo(value);
          try {
            const parsed = stringToExpression(value);

            updateStatement(node.id, (n) => {
              if (n.type !== "For") return n;

              return {
                ...n,
                to: parsed,
              };
            });
          } catch {}
        }}
        type="text"
      />
      <p>:</p>
      <input
        value={iterator}
        onChange={(e) => {
          const value = e.target.value;
          setIterator(value);
          try {
            const parsed = stringToExpression(value);

            updateStatement(node.id, (n) => {
              if (n.type !== "For") return n;

              return {
                ...n,
                iterator: parsed,
              };
            });
          } catch {}
        }}
        type="text"
      />
    </TripleBlockLayout>
  );
}
