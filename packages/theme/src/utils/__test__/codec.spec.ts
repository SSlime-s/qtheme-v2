import { lightTheme } from "../../default";
import { decodeTheme, encodeTheme, shareThemeScheme } from "../codec";

describe.concurrent("codec", () => {
  const validTheme = {
    title: "test",
    description: "test_description",
    type: "dark",
    theme: lightTheme,
  } as const;

  test("encode と decode をしてもテーマが壊れない", () => {
    const encoded = encodeTheme(validTheme);
    const decoded = decodeTheme(encoded);
    expect(decoded).toEqual(shareThemeScheme.parse(validTheme));
  });

  test("壊れたテーマを decode するとエラーになる", () => {
    const decoded = decodeTheme("invalid");
    expect(decoded).toBeInstanceOf(Error);
  });

  test("余計なプロパティは無視される", () => {
    const fromTheme = {
      ...validTheme,
      unknown: "unknown",
    } as const;
    const encoded = encodeTheme(fromTheme);
    const decoded = decodeTheme(encoded);
    expect(decoded).toEqual(shareThemeScheme.parse(fromTheme));
    expect(decoded).not.toHaveProperty("unknown");
  });

  test("プロパティが足りないとエラーになる", () => {
    const fromTheme: Omit<typeof validTheme, "title"> & {
      title?: string;
    } = {
      ...validTheme,
    };
    // biome-ignore lint/performance/noDelete: テストのために削除
    delete fromTheme.title;
    expect(() => encodeTheme(fromTheme as typeof validTheme)).toThrow();
  });

  test("encode したテーマは uriComponent として使える", () => {
    const encoded = encodeTheme(validTheme);
    const params = new URLSearchParams(`theme=${encoded}`);
    const decoded = decodeTheme(params.get("theme") ?? "invalid");
    expect(decoded).toEqual(shareThemeScheme.parse(validTheme));
  });
});
