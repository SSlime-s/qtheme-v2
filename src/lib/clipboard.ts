import { atom, useAtom, useAtomValue } from 'jotai'
import { getFocus } from './focus'

// window が focus を持っている間、1秒ごとに clipboard の値を同期する
const clipboardRawAtom = atom<string>('')
clipboardRawAtom.onMount = setAtom => {
  const sync = async () => {
    const clipboardValue = await navigator.clipboard.readText()
    setAtom(clipboardValue)
  }
  let id: number | null = null
  const repeat = async () => {
    try {
      await getFocus()
      await sync()
      id = window.setTimeout(repeat, 1000)
    } catch (e) {
      console.error(e)
    }
  }
  void repeat()

  return () => {
    if (id !== null) {
      window.clearTimeout(id)
    }
  }
}
const clipboardAtom = atom<string, [string], void>(
  get => get(clipboardRawAtom),
  (_, set, value) => {
    void navigator.clipboard.writeText(value)
    set(clipboardRawAtom, value)
  }
)

export const useClipboardValue = (): string => {
  const value = useAtomValue(clipboardAtom)
  return value
}
export const useClipboard = (): [
  value: string,
  setValue: (value: string) => void
] => {
  return useAtom(clipboardAtom)
}
