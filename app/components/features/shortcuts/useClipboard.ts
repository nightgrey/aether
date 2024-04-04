import { chain, useEffectEvent } from '@react-aria/utils';
import { useEffect } from 'react';
import { addGlobalEventListener } from './utils';

export interface ClipboardProps {
  /** Handler that is called when the user triggers a copy interaction. */
  onCopy?: (e: ClipboardEvent) => void;
  /** Handler that is called when the user triggers a cut interaction. */
  onCut?: (e: ClipboardEvent) => void;
  /** Handler that is called when the user triggers a paste interaction. */
  onPaste?: (e: ClipboardEvent) => void;
  /** Whether the clipboard is disabled. */
  isDisabled?: boolean;
}

/**
 * Handles global clipboard events.
 *
 * Note:
 *
 * Forked from react-aria and modified to not require a focusable element -
 * instead, the `isDisabled` prop decides whether to execute events or not. This
 * means it can still be dependent to a focusable element, but is not
 * required to.
 */
export function useClipboard(options: ClipboardProps) {
  const { isDisabled = false } = options;

  const onBeforeCopy = useEffectEvent((e: ClipboardEvent) => {
    // Enable the "Copy" menu item in Safari if this element is focused and copying is supported.
    if (isDisabled) {
      e.preventDefault();
    }
  });

  const onCopy = useEffectEvent((e: ClipboardEvent) => {
    if (isDisabled) {
      return;
    }

    e.preventDefault();

    options.onCopy?.(e);
  });

  const onBeforeCut = useEffectEvent((e: ClipboardEvent) => {
    if (!isDisabled && options.onCut) {
      e.preventDefault();
    }
  });

  const onCut = useEffectEvent((e: ClipboardEvent) => {
    if (isDisabled || !options.onCut) {
      return;
    }

    e.preventDefault();
    options.onCut(e);
  });

  const onBeforePaste = useEffectEvent((e: ClipboardEvent) => {
    // Unfortunately, e.clipboardData.types is not available in this event so we always
    // have to enable the Paste menu item even if the type of data is unsupported.
    if (!isDisabled && options.onPaste) {
      e.preventDefault();
    }
  });

  const onPaste = useEffectEvent((e: ClipboardEvent) => {
    if (isDisabled || !options.onPaste) {
      return;
    }

    e.preventDefault();

    options.onPaste(e);
  });

  useEffect(() => {
    return chain(
      // The `before*` events are supported by WebKit browsers. They are not in
      // the DOM standard, and thus not in the types.
      // http://help.dottoro.com/ljrlxaae.php
      addGlobalEventListener('beforecopy' as keyof DocumentEventMap, onBeforeCopy as EventListener),
      addGlobalEventListener('copy', onCopy),
      addGlobalEventListener('beforecut' as keyof DocumentEventMap, onBeforeCut as EventListener),
      addGlobalEventListener('cut', onCut),
      addGlobalEventListener('beforepaste' as keyof DocumentEventMap, onBeforePaste as EventListener),
      addGlobalEventListener('paste', onPaste),
    );
  }, [onBeforeCopy, onBeforeCut, onBeforePaste, onCopy, onCut, onPaste]);
}
