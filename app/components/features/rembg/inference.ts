import {
  AutoProcessor,
  type ImageFeatureExtractor,
  RawImage,
  SegformerForSemanticSegmentation,
  env,
  type Tensor,
} from '@xenova/transformers';
import { IS_CLIENT } from '~shared/env';
import { normalize, maskToRgba, resize } from './normalize';

// https://huggingface.co/docs/transformers.js/en/custom_usage#settings
env.allowLocalModels = false;

/** RMBG-1.4 expects tensor/image sizes of 1024 * 1024. */
export const MODEL_SIZE = {
  width: 1024,
  height: 1024,
};

type InferenceFn = (
  image: File,
  { width, height }: { width: number; height: number },
  type?: 'full' | 'quantized',
) => Promise<{
  input: File | null;
  output: {
    imageData: ImageData;
    blob: Blob;
  } | null;
  error: Error | unknown | null;
}>;

const postProcess = async (tensor: Tensor, size: [width: number, height: number]) => {
  if (IS_CLIENT) {
    window.t = tensor;
    window.s = size;
  }
  const clone = normalize(tensor);
  const [width, height] = size;

  const rgba = maskToRgba(clone);
  const resizedImage = await resize(rgba, [width, height]);
  const imageData = new ImageData(resizedImage, width, height);
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx?.putImageData(imageData, 0, 0);

  return {
    imageData,
    blob: await canvas.convertToBlob(),
  };
};

if (IS_CLIENT) {
  window.again = async (t = window.t, s = window.s) => {
    const { imageData, blob } = await postProcess(t, s);

    window.open(URL.createObjectURL(blob), '_blank');
  };
}

export const useTransformersJs: InferenceFn = async (image: File, { width, height }, type = 'quantized') => {
  const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4');
  const model = await SegformerForSemanticSegmentation.from_pretrained('briaai/RMBG-1.4');
  const session = model.session;

  const inputRawImage = await RawImage.fromBlob(image);
  const processedInput = await (processor(inputRawImage) as ReturnType<ImageFeatureExtractor['preprocess']>);

  const result = await model({ [session.inputNames[0]]: processedInput.pixel_values });
  //  [1, 1, 1024, 1024]
  const tensor = result[session.outputNames[0]] as Tensor;
  // const desiredSize = featureExtractor.get_resize_output_image_size(inputRawImage, processedInput.original_size);

  return {
    output: await postProcess(tensor, [width, height]),
    input: image,
    error: null,
  };
};

export const inference = useTransformersJs;
