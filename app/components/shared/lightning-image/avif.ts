import { type Dimensions, type FormatHandler, ImageType } from './image';

// This object is used to dynamically import the format handlers
export const avifHandler: FormatHandler = {
  type: ImageType.AVIF,
  isValid: isAvif,
  getDimensions: getAvifDimensions,
  isAnimated: isAvifAnimated,
};

function isAvif(imageDataView: DataView): boolean {
  // Check for "ftypavif"
  return (
    imageDataView.byteLength > 28 &&
    imageDataView.getUint32(4, false) === 0x66747970 &&
    imageDataView.getUint32(8, false) === 0x61766966
  );
}

function getAvifDimensions(imageDataView: DataView): Dimensions {
  let offset = 0;
  const dataSize = imageDataView.byteLength;

  while (offset < dataSize) {
    const boxSize = imageDataView.getUint32(offset, false);
    const boxType = imageDataView.getUint32(offset + 4, false);

    if (boxSize < 8) {
      break; // Invalid box size
    }

    // "ispe" box
    if (boxType === 0x69737065) {
      const width = imageDataView.getUint32(offset + 16, false);
      const height = imageDataView.getUint32(offset + 20, false);
      return { width, height };
    }

    offset += boxSize;
  }

  return { width: 0, height: 0 }; // Couldn't find dimensions
}

function isAvifAnimated(imageDataView: DataView): boolean {
  let offset = 0;
  const dataSize = imageDataView.byteLength;
  let trakCount = 0;

  while (offset < dataSize) {
    const boxSize = imageDataView.getUint32(offset, false);
    const boxType = imageDataView.getUint32(offset + 4, false);

    if (boxSize < 8) {
      break; // Invalid box size
    }

    // "trak" box
    if (boxType === 0x7472616b) {
      trakCount++;
      if (trakCount > 1) {
        return true; // Multiple tracks often imply animation
      }
    }

    offset += boxSize;
  }

  return false; // Single track or no track found
}
