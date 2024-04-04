import { type Dimensions, type FormatHandler, ImageType } from './image';

// This object is used to dynamically import the format handlers
export const pngHandler: FormatHandler = {
  type: ImageType.PNG,
  isValid: isPng,
  getDimensions: getPngDimensions,
  isAnimated: isPngAnimated,
};

function isPng(imageDataView: DataView): boolean {
  // Check the signature for a PNG image
  // PNG images start with an 8-byte signature, the first 4 bytes of which are: 0x89504E47
  return imageDataView.getUint32(0, false) === 0x89504e47;
}

function validateIHDR(imageDataView: DataView): void {
  // Check for the IHDR chunk (this should appear directly after the 8-byte PNG signature)
  const ihdr = String.fromCharCode(
    imageDataView.getUint8(12),
    imageDataView.getUint8(13),
    imageDataView.getUint8(14),
    imageDataView.getUint8(15),
  );
  if (ihdr !== 'IHDR') {
    throw new Error('IHDR chunk not found. Non-standard PNG.');
  }
}

function getPngDimensions(imageDataView: DataView): Dimensions {
  validateIHDR(imageDataView);
  // If IHDR is found, extract image dimensions
  // Width is at an offset of 16 bytes from the start, and height is at an offset of 20 bytes
  const width = imageDataView.getUint32(16, false);
  const height = imageDataView.getUint32(20, false);

  return { width, height };
}

function isPngAnimated(imageDataView: DataView): boolean {
  const PNG_SIGNATURE = 0x89504e47; // Corresponds to PNG header

  if (imageDataView.getUint32(0, false) !== PNG_SIGNATURE) return false;

  let offset = 8; // Start after the PNG header
  while (offset < imageDataView.byteLength - 4) {
    const chunkType = imageDataView.getUint32(offset + 4, false);
    if (chunkType === 0x6163544c) {
      // acTL chunk
      return true;
    }

    // Move to the next chunk: chunk length (4 bytes) + chunk type (4 bytes) + chunk data + CRC (4 bytes)
    offset += 12 + imageDataView.getUint32(offset, false);
  }

  return false;
}
