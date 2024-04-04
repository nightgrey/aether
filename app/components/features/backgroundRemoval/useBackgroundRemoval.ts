import {
  isFileDropItem,
  type DropOptions,
  useDrop,
  useFocusRing,
  useHover,
  useClipboard,
  type LabelAriaProps,
} from 'react-aria';
import { useFile } from '../../shared/useFile';
import { useRembg } from '~features/rembg';

import { mergeProps, useLabels, useSlotId } from '@react-aria/utils';
import { dataAttr } from '~shared/utils';
import { toast } from 'sonner';
import { createContext } from '~shared/createContext';
import type React from 'react';
import { useCallback } from 'react';
const jpg = 'image/jpeg';
const png = 'image/png';

export interface UseBackgroundRemovalProps
  extends Pick<LabelAriaProps, 'aria-label'>,
    Pick<React.ComponentProps<'form'>, 'onSubmit'> {
  /**
   * Initial value of the drop zone.
   */
  initialValue?: File | null;
  /**
   * Ref to the button that labels the drop zone.
   */
  buttonRef: React.RefObject<HTMLElement>;
  /**
   * Ref to the input[type="file"]
   */
  inputFileRef: React.RefObject<HTMLInputElement>;
  /**
   * Specifies what mime type of files are allowed.
   */
  acceptedFileTypes?: string[];
  /**
   * Specifies the use of a media capture mechanism to capture the media on the spot.
   */
  defaultCamera?: 'user' | 'environment';
}

export const useBackgroundRemoval = (props: UseBackgroundRemovalProps) => {
  const {
    initialValue,
    buttonRef,
    'aria-label': ariaLabel,
    acceptedFileTypes = [jpg, png],
    defaultCamera,
    inputFileRef: inputRef,
  } = props;

  const onDrop: DropOptions['onDrop'] = async (event) => {
    const item = event.items.find(isFileDropItem);

    if (item) {
      const _file = await item.getFile();
      setUpload(_file);
    }
  };

  const { dropProps, dropButtonProps, isDropTarget } = useDrop({
    ref: buttonRef,
    getDropOperation: (types) => {
      const isValid = acceptedFileTypes.some((type) => types.has(type));

      if (!isValid) {
        toast.error(`The image must be a ${acceptedFileTypes.join(' or ')}.`);
        return 'cancel';
      }

      return 'copy';
    },
    onDrop,
    hasDropButton: true,
  });

  const { hoverProps, isHovered } = useHover({});
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  const dropzoneId = useSlotId();
  const labelProps = useLabels({ 'aria-label': ariaLabel });

  const { clipboardProps } = useClipboard({
    onPaste: (items) => {
      onDrop({
        type: 'drop',
        items,
        x: 0,
        y: 0,
        dropOperation: 'copy',
      });
    },
  });
  const [output, setOutput, _inference, loadModel, isModelLoaded, outputMeta] = useRembg();
  const [upload, setUpload, uploadMeta] = useFile(initialValue);

  const inference = useCallback(
    async (type?: Parameters<typeof _inference>[1]) => {
      if (!upload) {
        throw new Error('No input file.');
      }

      // Note: Not always 100% reliable, but good enough for now.
      const showLoadingModelToast = !isModelLoaded();
      const loadingModelToast = showLoadingModelToast ? toast.loading(`Loading ${type} model ...`) : undefined;

      await loadModel(type);
      toast.dismiss(loadingModelToast);

      const inferenceToast = toast.loading('Crunching numbers ...', {
        description: `Depending on quality and device, this runs at least 15 seconds.`,
      });

      const result = await _inference(await createImageBitmap(upload), type);
      toast.dismiss(inferenceToast);

      return result;
    },
    [_inference, isModelLoaded, loadModel, upload],
  );

  const reset = () => {
    setUpload(null);
    setOutput(null);
  };

  const dropZoneProps: React.ComponentProps<'div'> = {
    ...mergeProps(dropProps, hoverProps, focusProps, clipboardProps),
    onClick: () => buttonRef.current?.focus(),
    'data-hovered': dataAttr(isHovered),
    'data-focused': dataAttr(isFocused),
    'data-focus-visible': dataAttr(isFocusVisible),
    'data-drop-target': dataAttr(isDropTarget),
  };

  const formProps: React.ComponentProps<'form'> = {
    id: 'background-removal',
    onReset: async (event) => {
      event.preventDefault();

      reset();
    },
    onSubmit: async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));

      const type = data.type as 'quantized' | 'full' | null;

      if (!type) {
        throw new Error('Invalid form data');
      }

      const result = await inference(type);

      console.log(result);
      if (result.error) {
        toast.error('Oops! Something went wrong.', { description: result.error.message });
      } else if (!result.output) {
        toast.error('Oops! Something went wrong.', { description: 'No output.' });
      } else {
        toast.success('Wohoo! Background removed!', { description: 'If you find any issues, contact me on 𝕏.' });
      }
    },
  };

  const triggerInputFile = () => {
    if (inputRef.current?.value != null) {
      inputRef.current.value = '';
    }

    inputRef.current?.click();
  };

  const inputFileTriggerProps = {
    onPress: () => {
      triggerInputFile();
    },
  };

  const inputFileProps: React.ComponentProps<'input'> = {
    type: 'file',
    ref: inputRef,
    style: { display: 'none' },
    accept: acceptedFileTypes?.toString(),
    onChange: (e) => {
      const files = e.target?.files;

      if (files) {
        const file = files.item(0);

        if (file) {
          onDrop({
            type: 'drop',
            items: [
              {
                kind: 'file',
                type: file.type,
                name: file.name,
                getFile: async () => file,
                getText: async () => await file.text(),
              },
            ],
            x: 0,
            y: 0,
            dropOperation: 'copy',
          });
        }
      }
    },
    capture: defaultCamera,
  };

  return {
    state: {
      upload: {
        file: upload,
        ...uploadMeta,
      },
      output: {
        file: output,
        ...outputMeta,
      },
      hasUpload: !!upload && !uploadMeta.isSettling,
      hasOutput: !!output && !outputMeta.isInferencing,
      isEmpty: !upload && !output,
      isFinished: !!output,
      isInferencing: outputMeta.isInferencing,
      isHovered,
      isFocused,
      isFocusVisible,
      isDropTarget,
    },
    actions: {
      setUpload,
      setOutput,
      inference,
      reset,
      triggerInputFile,
    },
    props: {
      inputFileTriggerProps,
      inputFileProps,
      dropZoneProps,
      formProps,
      labelProps: {
        id: dropzoneId,
      },
      dropButtonProps: {
        ...mergeProps(dropButtonProps, focusProps, clipboardProps, labelProps),
      },
    },
  };
};

export type UseBackgroundRemovalReturn = ReturnType<typeof useBackgroundRemoval>;

export type BackgroundRemovalContextValue = UseBackgroundRemovalReturn;

export const [BackgroundRemovalContext, useBackgroundRemovalContext] =
  createContext<BackgroundRemovalContextValue>('BackgroundRemovalContext');
