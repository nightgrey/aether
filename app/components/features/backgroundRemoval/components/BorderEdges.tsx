import { motion } from 'framer-motion';
import { cn, tw } from '~core/ui/utils';

/**
 * Renders border edge caps, inspired by Vercel.
 */
export const BorderEdges = ({ className, ...rest }: React.ComponentPropsWithoutRef<typeof motion.div>) => {
  const base = tw`absolute z-10 size-8 border-l-2 border-t-2 border-grey-300`;

  const classNames = {
    topLeft: 'left-[-2px] top-[-2px] rotate-0',
    topRight: 'right-[-2px] top-[-2px] rotate-90',
    bottomLeft: 'bottom-[-2px] left-[-2px] -rotate-90',
    bottomRight: 'bottom-[-2px] right-[-2px] rotate-180',
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      variants={{
        isHovered: {
          opacity: 1,
        },
        isFocused: {
          opacity: 1,
        },
      }}
      key="borderEdges"
    >
      <motion.div key="borderEdge-topLeft" className={cn(base, classNames.topLeft, className)} {...rest} />
      <motion.div key="borderEdge-topRight" className={cn(base, classNames.topRight, className)} {...rest} />
      <motion.div key="borderEdge-bottomLeft" className={cn(base, classNames.bottomLeft, className)} {...rest} />
      <motion.div key="borderEdge-bottomRight" className={cn(base, classNames.bottomRight, className)} {...rest} />
    </motion.div>
  );
};
