import { type ReactNode, useCallback } from "react";

import { useToast } from "./toast";

/** userId が null なら execute を実行せずに、エラートーストを出す */
export function useWithAuth<Args extends unknown[], Return>(
  userId: string | null,
  execute: (...args: Args) => Return | Promise<Return>,
  errorContent: ReactNode,
) {
  const { addToast } = useToast();

  const wrappedExecute = useCallback(
    async (...args: Args) => {
      if (userId === null) {
        addToast({
          content: errorContent,
          type: "error",
        });
        return;
      }

      return await execute(...args);
    },
    [addToast, errorContent, execute, userId],
  );

  return wrappedExecute;
}
