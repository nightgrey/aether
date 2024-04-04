import { type FormatHandler } from './image';
import * as PNG from './png';
import * as JPEG from './jpeg';
import * as GIF from './gif';
import * as WEBP from './webp';
import * as AVIF from './avif';
import * as BMP from './bmp';
import * as TIFF from './tiff';

const formatHandlers: FormatHandler[] = [
  PNG.pngHandler,
  JPEG.jpegHandler,
  GIF.gifHandler,
  WEBP.webpHandler,
  AVIF.avifHandler,
  BMP.bmpHandler,
  TIFF.tiffHandler,
];

type Input = Blob;

const getFormatHandler = async (view: DataView): Promise<FormatHandler> => {
  let formatHandler: FormatHandler | undefined;

  for (const handler of formatHandlers) {
    if (handler.isValid(view)) {
      formatHandler = handler;
      break;
    }
  }

  if (!formatHandler) {
    throw new Error('Not a recognized image format.');
  }

  return formatHandler;
};

const processImage = async (input: Input) => {
  const view = new DataView(await input.arrayBuffer());
  const formatHandler = await getFormatHandler(view);

  return {
    view,
    formatHandler,
  };
};

export async function getImageDimensions(input: Input) {
  const { view, formatHandler } = await processImage(input);

  return formatHandler.getDimensions(view);
}

export const getImageFormat = async (input: Input) => {
  const { formatHandler } = await processImage(input);

  return formatHandler.type;
};

export const isAnimated = async (input: Input) => {
  const { view, formatHandler } = await processImage(input);

  return formatHandler.isAnimated(view);
};

export const getInformation = async (input: Input) => {
  const { view, formatHandler } = await processImage(input);

  return {
    dimensions: formatHandler.getDimensions(view),
    type: formatHandler.type,
    animated: formatHandler.isAnimated(view),
  };
};
