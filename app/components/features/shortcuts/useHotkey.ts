import { useEffect } from 'react';
import { isHotkey } from 'is-hotkey';
import { type Key } from 'ts-key-enum';
import { useEffectEvent } from '@react-aria/utils';
import { addGlobalEventListener } from './utils';

interface UseHotKeyOptions {
  /** Whether the hotkey is disabled. */
  isDisabled?: boolean;
}

const useHotkey = (
  /**
   * Key or array of keys to trigger the handler.
   * @see {isHotkey}
   */
  key: (Key | string) | Array<Key | string>,
  /** Handler that is called when the key is pressed. */
  onKey: (event: KeyboardEvent) => void,
  options?: UseHotKeyOptions,
): void => {
  const { isDisabled = false } = options ?? {};

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (isDisabled || !isHotkey(key, { byKey: true }, event)) {
      return;
    }

    event.preventDefault();
    onKey(event);
  });

  useEffect(() => {
    return addGlobalEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useHotkey;
