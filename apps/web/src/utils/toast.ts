import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useId } from "react";

import type React from "react";
import type { Prettify } from "./typeUtils";

export interface ToastOptions {
	type: "info" | "success" | "error";
	content: React.ReactNode;
	key: string;
	durationMs?: number;
	onClick?: () => void;
}
export const toastAtom = atom<ToastOptions[]>([]);
export const useToast = () => {
	const setToasts = useSetAtom(toastAtom);
	const id = useId();

	const addToast = useCallback(
		(toast: Prettify<Omit<ToastOptions, "key">>) => {
			const key = `${id}-${toast.type}-${Date.now()}`;
			setToasts((toasts) => [...toasts, { ...toast, key }]);

			setTimeout(() => {
				setToasts((toasts) => toasts.filter((t) => t.key !== key));
			}, toast.durationMs ?? 2000);

			return key;
		},
		[id, setToasts],
	);

	return {
		addToast,
	};
};
export const useToastList = () => {
	const toasts = useAtomValue(toastAtom);
	return toasts;
};
