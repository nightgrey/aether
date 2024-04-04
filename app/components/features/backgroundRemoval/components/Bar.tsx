import * as React from 'react';
import { Button, buttonVariants } from '~core/ui/button';
import { Label } from '~core/ui/label';
import { Radio, RadioGroup } from '~core/ui/radio';
import { cn } from '~core/ui/utils';
import { useBackgroundRemovalContext } from '../useBackgroundRemoval';
import { motion } from 'framer-motion';
import { DownloadIcon, RotateCcw } from 'lucide-react';
import { Link } from '~core/ui/link';
import { dataAttr } from '~shared/utils';

interface BarProps extends React.ComponentPropsWithoutRef<'div'> {}

export const Bar = React.forwardRef<React.ElementRef<'div'>, BarProps>(({ className, children, ...rest }, ref) => {
  const {
    state: { isInferencing, isFinished, isEmpty, render },
    actions: { triggerInputFile },
  } = useBackgroundRemovalContext();

  const shouldShowUploadButton = isEmpty || isFinished;
  const showDownload = !(render.url == null);
  return (
    <motion.div className={cn(' bg-grey-500 p-5 text-white', className)}>
      <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-10 sm:space-y-0">
        <div className="flex flex-row space-x-5">
          <Button
            type={shouldShowUploadButton ? 'button' : 'submit'}
            isDisabled={isInferencing}
            isLoading={isInferencing}
            onPress={() => {
              if (shouldShowUploadButton) {
                triggerInputFile();
              }
            }}
          >
            {shouldShowUploadButton ? 'Upload image' : 'Remove it'}
          </Button>
          <Button
            variant="ghost"
            onPress={() => {
              if (showDownload) {
                const link = document.createElement('a');
                link.href = render.url!;
                link.download = 'render.png';
                link.click();
              }
            }}
            isDisabled={!showDownload}
          >
            <DownloadIcon />
          </Button>

          <Button type="reset" variant="ghost" isDisabled={!isFinished || isInferencing}>
            <RotateCcw />
          </Button>
        </div>
        <RadioGroup isDisabled={isInferencing} name="type" aria-labelledby="id" defaultValue="quantized">
          <Label>Quality</Label>
          <Radio value="quantized">Normal</Radio>
          <Radio value="full">High</Radio>
        </RadioGroup>
        {/* 
        <RadioGroup isDisabled aria-labelledby="id" defaultValue="cpu">
          <Label>Device</Label>
          <Radio value="cpu">CPU</Radio>
        </RadioGroup> */}
      </div>
    </motion.div>
  );
});
