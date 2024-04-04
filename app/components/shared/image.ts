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

interface Size {
  width: number;
  height: number;
}

export const contain = (input: Size, desired: Size) => {
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

export { getImageDimensions, getImageFormat, getInformation } from './lightning-image';
