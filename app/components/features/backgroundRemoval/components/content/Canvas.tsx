import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '~core/ui/utils';
import { useBackgroundRemovalContext } from '~features/backgroundRemoval/useBackgroundRemoval';
import { contain, toImageBitmap } from '~shared/image';
import { MODEL_SIZE } from '~features/rembg';
import { mergeRefs } from '@react-aria/utils';
import { IS_DEV } from '~shared/platform';

interface CanvasProps extends React.ComponentPropsWithoutRef<typeof motion.canvas> {}

export const Canvas = React.forwardRef<React.ElementRef<'canvas'>, CanvasProps>(({ className, ...rest }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    state: { upload, output, hasOutput, hasUpload },
  } = useBackgroundRemovalContext();

  const [isRendering, setIsRendering] = useState(false);

  const [hasRenderedUpload, setHasRenderedUpload] = useState(false);
  const [hasRenderedOutput, setHasRenderedOutput] = useState(false);

  const draw = async (source: File | ImageData, context: CanvasRenderingContext2D) => {
    const image = await toImageBitmap(source);
    const canvasWidth = MODEL_SIZE.width;
    const canvasHeight = MODEL_SIZE.height;

    const { width, height, x, y } = contain(image, { width: canvasWidth, height: canvasHeight });
    context.drawImage(image, x, y, width, height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) return;
    if (isRendering) return;

    const run = async () => {
      setIsRendering(true);

      const context = canvas.getContext('2d');

      if (context === null) return;

      // Upload, no output
      if (hasUpload && !hasOutput && !hasRenderedUpload) {
        await draw(upload.file!, context);
        setHasRenderedUpload(true);
      }

      // Output + Upload
      if (hasUpload && hasOutput && !hasRenderedOutput) {
        context.reset();
        await draw(output.file!, context);

        context.globalCompositeOperation = 'source-in';

        await draw(upload.file!, context);

        setHasRenderedOutput(true);
      }

      setIsRendering(false);
    };

    void run();
  }, [canvasRef, hasOutput, hasRenderedOutput, hasRenderedUpload, hasUpload, isRendering, output.file, upload]);

  const test = (event) => {
    event?.preventDefault();

    console.log(URL.createObjectURL(output.file!));
  };

  return (
    <>
      <motion.canvas
        key="canvas"
        initial={{
          scale: 0.75,
        }}
        variants={{
          visible: {
            scale: 1,
          },
          isDropTarget: {
            scale: 0.75,
            opacity: 0.5,
          },
        }}
        exit={{
          scale: 0.75,
          opacity: 0,
          transition: {
            duration: 0.1,
          },
        }}
        width={MODEL_SIZE.width}
        height={MODEL_SIZE.height}
        className={cn('absolute max-h-full w-auto max-w-[var(--width)px] max-w-full object-contain', className)}
        {...rest}
        ref={mergeRefs(canvasRef, ref)}
      />
      {IS_DEV && (
        <button type="button" className="absolute bottom-20 right-20" onClick={test}>
          Test
        </button>
      )}
    </>
  );
});
