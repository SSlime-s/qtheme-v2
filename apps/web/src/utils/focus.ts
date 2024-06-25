/// hasFocus が true になったら解決する
export const getFocus = () =>
  new Promise<void>((resolve) => {
    if (document.hasFocus()) {
      resolve();
      return;
    }

    window.addEventListener("focus", () => resolve(), {
      once: true,
    });
  });
