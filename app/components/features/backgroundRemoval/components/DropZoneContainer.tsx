import * as React from 'react';
import { cn } from '~core/ui/utils';
import { motion } from 'framer-motion';
import { useBackgroundRemovalContext } from '../useBackgroundRemoval';

interface DropZoneContainerProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children?: React.ReactNode;
}

export const DropZoneContainer = React.forwardRef<React.ElementRef<'div'>, DropZoneContainerProps>((props, ref) => {
  const { className, ...rest } = props;

  const { state } = useBackgroundRemovalContext();

  const animate = (Object.keys(state) as Array<keyof typeof state>)
    .filter((key) => key !== 'output' && key !== 'upload')
    .filter((key) => Boolean(state[key]));

  return (
    <motion.div
      {...rest}
      ref={ref}
      animate={['visible', ...animate]}
      className={cn(
        `group relative flex h-full min-h-0 w-full flex-grow items-center justify-center overflow-hidden border-2 border-solid
        border-grey-500 p-4`,
        'data-hovered:border-grey-400 data-focused:border-grey-400',
        `data-drop-target:cursor-copy data-drop-target:border-dashed data-drop-target:border-grey-400
        data-drop-target:bg-grey-600`,
        'data-value:cursor-default',
        className,
      )}
    />
  );
});
