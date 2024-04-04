import type React from 'react';
import { type motion, AnimatePresence } from 'framer-motion';
import { useBackgroundRemovalContext } from '../../useBackgroundRemoval';
import { Empty } from './Empty';
import { CloseButton } from './CloseButton';
import { Image } from './Image';
import { DropIndicator } from './DropIndicator';
import { BorderEdges } from '~features/backgroundRemoval/components/BorderEdges';
import { Canvas } from '~features/backgroundRemoval/components/content/Canvas';

export const Content = ({ className, children, ...rest }: React.ComponentProps<typeof motion.div>) => {
  const {
    state: { hasUpload, hasOutput, isDropTarget },
  } = useBackgroundRemovalContext();

  return (
    <AnimatePresence>
      {!isDropTarget && !hasUpload && <Empty key="empty" />}

      {hasUpload && <CloseButton key="closeButton" />}
      {/*       {hasOutput && <Image key="output" src={output.url} />}
      {hasUpload && <Image key="upload" src={upload.url} />} */}

      {(hasUpload || hasOutput) && <Canvas key="canvas" />}
      {isDropTarget && <DropIndicator key="dropIndicator" />}

      <BorderEdges />
    </AnimatePresence>
  );
};
