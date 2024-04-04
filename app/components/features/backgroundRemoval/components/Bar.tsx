import * as React from 'react';
import { Button } from '~core/ui/button';
import { Label } from '~core/ui/label';
import { Radio, RadioGroup } from '~core/ui/radio';
import { cn } from '~core/ui/utils';
import { useBackgroundRemovalContext } from '../useBackgroundRemoval';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface BarProps extends React.ComponentPropsWithoutRef<'div'> {}

export const Bar = React.forwardRef<React.ElementRef<'div'>, BarProps>(({ className, children, ...rest }, ref) => {
  const {
    state: { hasUpload: hasImage, isInferencing, isFinished, isEmpty },
    actions: { triggerInputFile },
  } = useBackgroundRemovalContext();

  return (
    <motion.div className={cn(' bg-grey-500 p-5 text-white', className)}>
      <div className="flex items-center justify-center space-x-10">
        <Button
          type={isEmpty ? 'button' : 'submit'}
          isDisabled={!isEmpty ? isInferencing : false}
          isLoading={isInferencing}
          onPress={(event) => {
            if (isEmpty) {
              triggerInputFile();
            }
          }}
        >
          {isEmpty ? 'Upload image' : 'Remove background'}
        </Button>
        <Button type="reset" variant="ghost" isDisabled={!isFinished}>
          <RotateCcw />
        </Button>
        <RadioGroup name="type" aria-labelledby="id" defaultValue="quantized">
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
