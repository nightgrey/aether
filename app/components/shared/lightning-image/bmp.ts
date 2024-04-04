import { type Dimensions, type FormatHandler, ImageType } from './image';

// This object is used to dynamically import the format handlers
export const bmpHandler: FormatHandler = {
  type: ImageType.BMP,
  isValid: isBmp,
  getDimensions: getBmpDimensions,
  isAnimated: () => false,
};

function isBmp(imageDataView: DataView): boolean {
  return imageDataView.byteLength > 2 && imageDataView.getUint16(0, false) === 0x424d; // 'BM' in ASCII
}

function getBmpDimensions(imageDataView: DataView): Dimensions {
  return {
    width: imageDataView.getUint32(18, true), // little-endian
    height: Math.abs(imageDataView.getUint32(22, true)), // little-endian (height can be negative for top-down DIBs)
  };
}
