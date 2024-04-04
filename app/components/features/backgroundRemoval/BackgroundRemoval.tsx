import { useRef } from 'react';
import { Bar } from './components/Bar';
import { Container } from '~core/ui/container';
import { useBackgroundRemoval, BackgroundRemovalContext } from './useBackgroundRemoval';
import useHotkey from '~features/shortcuts/useHotkey';
import { Key } from 'ts-key-enum';
import { Content } from './components/content';
import { DropZoneContainer } from './components/DropZoneContainer';
import { VisuallyHidden } from 'react-aria';
import type { motion } from 'framer-motion';
import { Form } from '@remix-run/react';

export const BackgroundRemoval = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const backgroundRemovalContext = useBackgroundRemoval({
    'aria-label': 'Drop zone for image file',
    inputFileRef,
    buttonRef,
  });

  const {
    state: { isEmpty },
    actions: { reset },
    props: { dropZoneProps, dropButtonProps, inputFileProps, formProps },
  } = backgroundRemovalContext;

  useHotkey([Key.Escape, 'space'], () => {
    if (!isEmpty) reset();
  });

  return (
    <form tabIndex={-1} {...formProps} className="background-removal group h-full focus-visible:outline-none">
      <Container orientation="both" className="relative flex h-full flex-col pb-0">
        <BackgroundRemovalContext.Provider value={backgroundRemovalContext}>
          {/* Just some disagreement about the exact event shape... */}
          <DropZoneContainer {...(dropZoneProps as React.ComponentProps<typeof motion.div>)}>
            <Content />
          </DropZoneContainer>

          <Bar />

          <VisuallyHidden>
            {/* Note: The input is only used for triggering the file picker. States are handled via `upload` and `setUpload`, only. */}
            <input ref={inputFileRef} {...inputFileProps} />
            <button tabIndex={1} type="submit" {...dropButtonProps} ref={buttonRef} />
          </VisuallyHidden>
        </BackgroundRemovalContext.Provider>
      </Container>
    </form>
  );
};
