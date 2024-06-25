import { useCallback, useRef, useState } from "react";

export const useAutoRestoreState = <T>(defaultValue: T, durationMs = 700) => {
	const [value, setValue] = useState<T>(defaultValue);
	const timerIdRef = useRef<number>();

	const setValueWillRestore: typeof setValue = useCallback(
		(action) => {
			setValue(action);

			if (timerIdRef.current !== null) {
				clearTimeout(timerIdRef.current);
			}

			timerIdRef.current = window.setTimeout(() => {
				setValue(defaultValue);
			}, durationMs);
		},
		[defaultValue, durationMs],
	);

	return [value, setValueWillRestore] as const;
};
