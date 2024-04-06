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
import { getImageDimensions } from '~shared/lightning-image';
import { calculateRatio, findNearestNormalAspectRatio } from '~shared/image';

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

      const dimensions = await getImageDimensions(_file);
      const ratio = calculateRatio(dimensions);

      if (ratio > 1.3) {
        const nearestNormalAspectRatio = findNearestNormalAspectRatio(dimensions);

        toast.info('Tip: Use an 1:1 aspect ratio', {
          description: `Your image has an aspect ratio of ~ ${nearestNormalAspectRatio}. It will work, but if you have masking issues, try cropping to ~ 1:1.`,
          duration: 15000,
        });
      }

      setUpload(_file);
      setOutput(null);
      setRender(null);
    }
  };

  const { dropProps, dropButtonProps, isDropTarget } = useDrop({
    ref: buttonRef,
    getDropOperation: (types) => {
      if (outputMeta.isInferencing) return 'cancel';
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
      const isValid = items.every((item) => {
        if (!isFileDropItem(item)) return false;

        return acceptedFileTypes.includes(item.type);
      });

      if (!isValid) {
        toast.error(`The image must be a ${acceptedFileTypes.join(' or ')}.`);
        return;
      }

      if (items.length > 1) {
        toast.error('Only one image at a time, sorry.');
        return;
      }

      onDrop({
        type: 'drop',
        items,
        x: 0,
        y: 0,
        dropOperation: 'copy',
      });
    },
  });

  const [render, setRender, renderMeta] = useFile(null);
  const [output, setOutput, _inference, outputMeta] = useRembg();
  const [upload, setUpload, uploadMeta] = useFile(initialValue);

  const inference = useCallback(
    async (type?: Parameters<typeof _inference>[1]) => {
      if (!upload) {
        throw new Error('No input file.');
      }

      const inferenceToast = toast.loading('Crunching numbers ...', {
        description: `Depending on quality and device, this runs at least 15 seconds.`,
        important: true,
      });

      const result = await _inference(upload, type);
      toast.dismiss(inferenceToast);
      return result;
    },
    [_inference, upload],
  );

  const reset = () => {
    setUpload(null);
    setOutput(null);
    setRender(null);
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

      const type = data.type as 'quantized' | 'full' | undefined;

      await inference(type);
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
      render: {
        file: render,
        ...renderMeta,
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
      setRender,
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
