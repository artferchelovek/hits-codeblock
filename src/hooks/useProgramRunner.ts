import { useBlockContext } from "../context/BlockContext.tsx";
import { useCompileContext } from "../context/CompileContext.tsx";
import { useCallback, useRef, useState } from "react";
import { Interpreter } from "../Class/Interpreter.ts";
import { renderExpression } from "../logic/expression.ts";
import type { ExpressionNode, VariableForDebug } from "../types/ast.ts";

export const useProgramRunner = () => {
  const { program, setActiveNode, setErrorNode } = useBlockContext();
  const { addPrintable, clearPrintable } = useCompileContext();

  const [isRunning, setIsRunning] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const [debugVariables, setDebugVariables] = useState<VariableForDebug[]>([]);

  const runtimeRef = useRef<ReturnType<Interpreter["interpreter"]> | null>(
    null,
  );
  const stopRequested = useRef(false);

  const sendError = useCallback(
    (error: unknown) => {
      if (
        error instanceof Error &&
        error.cause &&
        typeof error.cause === "object" &&
        "BlockId" in error.cause
      ) {
        setErrorNode(
          (error.cause as { BlockId: string }).BlockId,
          error.message,
        );
      } else {
        console.error(error);
      }
    },
    [setErrorNode],
  );

  const stop = useCallback(() => {
    stopRequested.current = true;
    setIsRunning(false);
    setIsDebug(false);
    setActiveNode(null);
    setDebugVariables([]);
    runtimeRef.current = null;
  }, [setActiveNode]);

  const start = async () => {
    clearPrintable();
    setErrorNode(null, undefined);
    setIsRunning(true);
    setIsDebug(false);
    stopRequested.current = false;
    let runTime = 0;

    try {
      const runtime = new Interpreter(program).interpreter();
      let result = runtime.next();
      let counter = 0;

      while (!result.done) {
        if (stopRequested.current) break;

        if (result.value?.type === "Print") {
          addPrintable(renderExpression(result.value.print as ExpressionNode));
        }

        result = runtime.next();
        counter++;

        if (counter % 50 === 0) await new Promise((res) => setTimeout(res, 0));
      }
      runTime = result.value.time || 0;
    } catch (e) {
      sendError(e);
    } finally {
      setIsRunning(false);
      addPrintable(`Compilation time: ${runTime}s`);
    }
  };

  const debug = () => {
    clearPrintable();
    setErrorNode(null, undefined);
    setIsRunning(true);
    setIsDebug(true);
    stopRequested.current = false;
    runtimeRef.current = new Interpreter(program).interpreter();

    nextStep();
  };

  const nextStep = () => {
    if (!runtimeRef.current) return;

    try {
      const result = runtimeRef.current.next();
      if (result.done) {
        const time = result.value?.time || 0;
        addPrintable(`Compilation time: ${time}s`);
        stop();
      } else {
        setActiveNode(result.value.id);

        if (result.value.variableAll) {
          setDebugVariables(result.value.variableAll);
        }

        if (result.value.type === "Print") {
          addPrintable(renderExpression(result.value.print as ExpressionNode));
        }
      }
    } catch (e) {
      sendError(e);
      stop();
    }
  };

  return {
    isRunning,
    isDebug,
    start,
    debug,
    stop,
    nextStep,
    debugVariables,
  };
};
