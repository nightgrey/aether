export const getCanvas = async (width: number, height: number) => {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d')!;
  return { canvas, context };
};

export const uint8ToImageData = async (array: Uint8ClampedArray, width: number, height: number) =>
  new ImageData(array, width, height);

export const blobToUint8Array = async (blob: Blob) => new Uint8ClampedArray(await blob.arrayBuffer());

export const blobToImageElement = async (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const imageElement = await urlToImageElement(url);
  URL.revokeObjectURL(url);
  return imageElement;
};

export const blobToImageData = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;

  const { context } = await getCanvas(width, height);

  context.drawImage(bitmap, 0, 0);

  return context.getImageData(0, 0, width, height);
};

export const canvasToImageData = async (canvas: HTMLCanvasElement) =>
  new ImageData(
    canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data,
    canvas.width,
    canvas.height,
  );

export const imageElementToImageData = async (image: HTMLImageElement) => {
  const { context } = await getCanvas(image.width, image.height);

  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
};

export const urlToImageElement = async (url: string) => {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = '';
    image.src = url;

    image.onerror = (error) => {
      reject(error);
    };

    image.onload = () => {
      resolve(image);
    };
  });
};

export const urlToImageData = async (url: string) => {
  const image = await urlToImageElement(url);

  return await imageElementToImageData(image);
};

export const imageDataToCanvas = async (image: ImageData) => {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const context = canvas.getContext('2d')!;

  context.putImageData(image, 0, 0);

  return canvas;
};

export const imageDataToBlob = async (image: ImageData) => {
  const canvas = await imageDataToCanvas(image);
  return await canvas.convertToBlob();
};

export const imageDataToFile = async (image: ImageData) => {
  const blob = await imageDataToBlob(image);
  return await blobToFile(blob);
};

export const urlToBlob = async (url: string) => {
  return await fetch(url).then(async (res) => await res.blob());
};

export const urlToFile = async (url: string) => {
  const blob = await urlToBlob(url);
  return await blobToFile(blob);
};

export const blobToFile = async (blob: Blob, name = 'image.png') => {
  return new File([blob], name, { type: 'image/png' });
};

export const uint8ToFile = async (blob: Uint8Array, name = 'image.png') => {
  return new File([blob], name);
};

export const fileToBlob = async (file: File) => {
  return new Blob([file]);
};

export const toImageBitmap = async (source: CanvasImageSource | Blob | ImageData) => {
  return await createImageBitmap(source);
};

export const fileToBuffer = async (file: File) => {
  return Buffer.from(await file.arrayBuffer());
};

export const bufferToFile = async (buffer: Buffer, options: FilePropertyBag, name = 'image.png') => {
  return new File([buffer], name, options);
};

export interface ImageSize {
  width: number;
  height: number;
}

export const contain = (input: ImageSize, desired: ImageSize) => {
  const { width, height } = input;
  const aspectRatio = width / height;

  const desiredWidth = desired.width;
  const desiredHeight = desired.height;

  let resultWidth = desiredWidth;
  let resultHeight = desiredHeight;

  if (aspectRatio > 1) {
    resultHeight = desiredWidth / aspectRatio;
  } else {
    resultWidth = desiredHeight * aspectRatio;
  }

  const x = (desiredWidth - resultWidth) / 2;
  const y = (desiredHeight - resultHeight) / 2;

  return {
    width: resultWidth,
    height: resultHeight,
    x,
    y,
  };
};

const findGreatestCommonDivisor = (a: number, b: number): number => {
  let t;
  while (b !== 0) {
    t = a % b;
    a = b;
    b = t;
  }
  return a;
};

const findDividendAndDivisor = (a: number, b: number): [dividend: number, divisor: number] => {
  if (a > b) return [a, b];
  return [b, a];
};

export const calculateRatio = (of: ImageSize): number => {
  const { width, height } = of;

  if (width === height) return 1;

  let dividend = 0;
  let divisor = 0;

  if (height > width) {
    dividend = height;
    divisor = width;
  } else if (width > height) {
    dividend = width;
    divisor = height;
  }

  return dividend / divisor;
};

export const calculateAspectRatio = (of: ImageSize): [horizontalRatio: number, verticalRatio: number] => {
  const { width, height } = of;

  if (width === height) return [1, 1];

  const [dividend, divisor] = findDividendAndDivisor(width, height);
  const greatestCommonDivisor = findGreatestCommonDivisor(dividend, divisor);

  return [width / greatestCommonDivisor, height / greatestCommonDivisor];
};

/**
 * Generates all normal aspect ratios
 *
 * @see https://codepen.io/malthemillthers/pen/EyPELe
 */
const generateNormalRatios = (maxHorizontalRatio: number = 16, maxVerticalRatio: number = 16) => {
  const horizontalRatios = Array.from({ length: maxHorizontalRatio }, (_, i) => i + 1);
  const verticalRatios = Array.from({ length: maxVerticalRatio }, (_, i) => i + 1);
  const registeredRatios: Record<string, boolean> = {};
  const ratios: Record<`${number}:${number}`, number> = {};

  for (let i = 0; i < horizontalRatios.length; i++) {
    const horizontalRatio = horizontalRatios[i];
    for (let j = 0; j < verticalRatios.length; j++) {
      const verticalRatio = verticalRatios[j];
      const ratio = (horizontalRatio * 100) / (verticalRatio * 100);

      if (!registeredRatios[ratio]) {
        registeredRatios[ratio] = true;

        ratios[`${horizontalRatio}:${verticalRatio}`] = ratio;
      }
    }
  }

  return ratios;
};

export const normalRatios = generateNormalRatios();

/**
 * Finds the nearest normal aspect ratio for the provided size
 * @see https://codepen.io/malthemillthers/pen/EyPELe
 */
export const findNearestNormalAspectRatio = function (size: ImageSize, ratios = normalRatios) {
  const { width, height } = size;
  const ratio = (width * 100) / (height * 100);

  let match;
  let minDifference = Infinity;

  for (const key in ratios) {
    const currentRatio = ratios[key as keyof typeof ratios];
    const difference = Math.abs(ratio - currentRatio);

    if (
      difference < minDifference ||
      (currentRatio <= ratio && difference === minDifference) ||
      (currentRatio >= ratio && difference === minDifference)
    ) {
      match = key;
      minDifference = difference;
    }
  }

  return match;
};

export { getImageDimensions, getImageFormat, getInformation } from './lightning-image';
