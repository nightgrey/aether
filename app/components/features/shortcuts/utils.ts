interface GlobalEventData {
  listener: EventListener;
  handlers: Set<EventListener>;
}

const globalEvents = new Map<keyof DocumentEventMap, GlobalEventData>();

/**
 * Adds a global event listener to the document.
 *
 * @template EventKey - The type of event to listen for.
 * @param {EventKey} type - The type of event to listen for.
 * @param {(event: DocumentEventMap[EventKey]) => void} fn - The event handler function.
 * @returns A function to remove the event listener.
 */
export function addGlobalEventListener<EventKey extends keyof DocumentEventMap>(
  type: EventKey,
  fn: (event: DocumentEventMap[EventKey]) => void,
) {
  const _fn = fn as EventListener;
  let eventData = globalEvents.get(type);

  if (!eventData) {
    const handlers = new Set<EventListener>();

    const listener: EventListener = (e) => {
      for (const handler of handlers) {
        handler(e);
      }
    };

    eventData = { listener, handlers };
    globalEvents.set(type, eventData);

    document.addEventListener(type, listener);
  }

  eventData.handlers.add(_fn);

  return () => {
    eventData.handlers.delete(_fn);

    if (eventData.handlers.size === 0) {
      document.removeEventListener(type, eventData.listener);
      globalEvents.delete(type);
    }
  };
}
