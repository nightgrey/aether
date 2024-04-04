import { type Dimensions, type FormatHandler, ImageType } from './image';

const GIF_EXTENSION_BLOCK = 0x21;
const GRAPHIC_CONTROL_EXTENSION = 0xf9;

// This object is used to dynamically import the format handlers
export const gifHandler: FormatHandler = {
  type: ImageType.GIF,
  isValid: isGif,
  getDimensions: getGifDimensions,
  isAnimated: isGifAnimated,
};

function isGif(imageDataView: DataView): boolean {
  // The GIF format starts with either "GIF87a" or "GIF89a".
  return (
    imageDataView.byteLength > 6 &&
    imageDataView.getUint16(0, false) === 0x4749 &&
    imageDataView.getUint16(2, false) === 0x4638 &&
    (imageDataView.getUint8(4) === 0x37 || imageDataView.getUint8(4) === 0x39) &&
    imageDataView.getUint8(5) === 0x61
  );
}

function getGifDimensions(imageDataView: DataView): Dimensions {
  // The width and height are 2 bytes each, in little-endian format.
  // They come immediately after the signature.
  const width = imageDataView.getUint16(6, true); // little-endian
  const height = imageDataView.getUint16(8, true); // little-endian
  return { width, height };
}

function isGifAnimated(imageDataView: DataView): boolean {
  let offset: number = 10;
  offset += 3 * (1 << ((imageDataView.getUint8(10) & 0x07) + 1));

  let frameCount: number = 0;

  while (offset < imageDataView.byteLength - 1) {
    const blockType: number = imageDataView.getUint8(offset);

    if (blockType === GIF_EXTENSION_BLOCK && imageDataView.getUint8(offset + 1) === GRAPHIC_CONTROL_EXTENSION) {
      const delayTime: number = imageDataView.getUint16(offset + 3, true);
      if (delayTime > 0) {
        frameCount++;
      }

      if (frameCount > 1) {
        return true; // Two frames with delay found, it's animated!
      }

      offset += 8; // Jump past this block to continue searching
    } else {
      offset++; // Go byte by byte until the next block
    }
  }

  return false;
}
