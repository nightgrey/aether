import * as onnx from '~shared/onnx';
import * as tf from '~shared/tf';
import { uint8ToImageData } from '~shared/image';
import type { Image } from 'imagescript';

// https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers
tf.setWasmPaths('http://localhost:3000/tfjs/');

/** Available model types. */
const TYPE = {
  full: '/rmbg/model.onnx',
  quantized: '/rmbg/model_quantized.onnx',
};

/** RMBG-1.4 expects tensor/image sizes of 1024 * 1024. */
export const MODEL_SIZE = {
  width: 1024,
  height: 1024,
};

type Pixels = HTMLImageElement | HTMLCanvasElement | ImageData | ImageBitmap;

/**
 * Pre-processes the image before inference.
 *
 * ImageData => ([1, 3, 1024, 1024])
 */
export const preProcessImage = async (pixels: Parameters<typeof tf.browser.fromPixels>[0]) => {
  /*
   * Original process:
   * ```python
   *   if len(image.shape) < 3:
   *       image = image[:, :, np.newaxis]
   *
   *   tensor = torch.tensor(im, dtype=torch.float32).permute(2,0,1)
   *   tensor = F.interpolate(torch.unsqueeze(tensor,0), size=(1024, 1024), mode='bilinear').type(torch.uint8)
   *
   *   image = torch.divide(tensor,255.0)
   *   image = normalize(image,[0.5,0.5,0.5],[1.0,1.0,1.0])
   *
   *   return image
   * ```
   * */

  // [H, W, C]
  const image = tf.browser.fromPixels(pixels, 3);

  const resized = image.resizeBilinear([1024, 1024]);

  // [C, W, H]
  const transposed = resized.transpose([2, 0, 1]);

  const divided = transposed.div(tf.scalar(255));

  const normalized = divided;

  // [1, C, H, W]
  const expanded = normalized.expandDims(0);

  console.log(expanded);
  const onnxTensor = await tf.toOnnx(expanded);

  return onnxTensor;
};
/**
 *
 * Post-processes the image after inference.
 *
 * ([1, 1, 1024, 1024]) => ([imageHeight, imageWidth, 4]) => ImageData
 *
 * @param tensor
 * @param options
 * @returns
 */
export const postProcessImage = async (tensor: onnx.Tensor, options?: { height: number; width: number }) => {
  const DEFAULT_OPTIONS = { height: 1024, width: 1024 };
  const { height, width } = { ...DEFAULT_OPTIONS, ...options };

  console.log(height, width);
  /*
   * Original process:
   *
   * ```python
   * // Remove 1. dimension ([1, 1024, 1024]), then resize to image_size
   * image_size = (1024, 1024)
   * result = torch.squeeze(F.interpolate(result, size=image_size, mode='bilinear'), 0)
   * // Get max and min values
   * max = torch.max(result)
   * min = torch.min(result)
   * // Normalize (0-1).
   * result = (result-min)/(max-min)
   * // Scale to 0-255.
   * image_array = (result*255)
   * // Re-arrange dimmensions from [C, H, W] -> [H, W, C]
   * image_array = permute(1,2,0)
   * // Removes dimensions of size 1, i.e. [W, H, 1] -> [W, H]
   * image_array = np.squeeze(image_array)
   * return image_array
   * ```
   */

  const _tensor = await onnx.toTf(tensor);
  const HWC = _tensor
    // Remove batch size
    .squeeze([0])
    // Reshape to [1024, 1024, C]
    .reshape([1024, 1024, 1])
    .resizeBilinear([height, width]);

  // .. Normalize to 0-1
  const min = tf.min(HWC);
  const max = tf.max(HWC);

  const normalized = HWC.sub(min).div(max.sub(min));

  const rgb = normalized.mul(255);

  // Concatenate with alpha channel in the last dimension, making it [1024, 1024, 4]
  const rgba = tf.concat([tf.zeros([height, width, 3]), rgb], -1);

  const pixels = await tf.browser.toPixels(rgba.toInt() as tf.Tensor3D);

  return await uint8ToImageData(pixels, width, height);
};

export let session: onnx.InferenceSession | null = null;

export const loadModel = async (type: 'full' | 'quantized' = 'quantized') => {
  session =
    session ??
    (await onnx.InferenceSession.create(TYPE[type], {
      executionProviders: ['wasm'],
    }));
};

// @TODO: Not completely true, but good enough for now.
export const isModelLoaded = () => !!session;

// https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js
export const inference = async (
  image: Pixels,
  type: 'full' | 'quantized' = 'quantized',
): Promise<{
  input: Pixels | null;
  output: ImageData | null;
  error: Error | unknown | null;
}> => {
  try {
    session =
      session ??
      (await onnx.InferenceSession.create(TYPE[type], {
        executionProviders: ['wasm'],
      }));

    if (tf.getBackend() !== 'wasm') {
      await tf.setBackend('wasm');
      await tf.ready();
    }

    const input = await preProcessImage(image);

    const { [session.outputNames[0]]: output } = await session.run({
      [session.inputNames[0]]: input,
    });

    const mask = await postProcessImage(output, {
      height: image.height,
      width: image.width,
    });

    return {
      output: mask,
      input: image,
      error: null,
    };
  } catch (error) {
    return {
      output: null,
      input: null,
      error,
    };
  }
};
