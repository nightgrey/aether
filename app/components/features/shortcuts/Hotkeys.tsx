import * as React from 'react';
import { Kbd } from '~core/ui/kbd';
import { Key } from 'ts-key-enum';

type HotkeysProp = Array<{ keys: Array<Key | string>; label: string }>;

interface HotkeysProps extends React.ComponentPropsWithoutRef<'div'> {
  hotkeys?: HotkeysProp;
}

const DEFAULT_HOTKEYS: HotkeysProp = [
  { keys: [Key.Control, 'V'], label: 'Paste image' },
  { keys: [Key.Escape], label: 'Remove image' },
];

export const Hotkeys = React.forwardRef<React.ElementRef<'div'>, HotkeysProps>(
  ({ className, children, hotkeys = DEFAULT_HOTKEYS, ...rest }, ref) => {
    return (
      <div className="flex space-x-4 text-sm">
        {hotkeys.map(({ keys, label }, i) => (
          <div key={keys.join('-')}>
            {keys.map((key, _i) => {
              return (
                <React.Fragment key={[...keys, key, i].join('-')}>
                  <Kbd>{key}</Kbd> {_i !== keys.length - 1 && <span> + </span>}
                </React.Fragment>
              );
            })}

            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  },
);
