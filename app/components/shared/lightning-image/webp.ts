import { type Dimensions, type FormatHandler, ImageType } from './image';

// This object is used to dynamically import the format handlers
export const webpHandler: FormatHandler = {
  type: ImageType.WEBP,
  isValid: isWebp,
  getDimensions: getWebpDimensions,
  isAnimated: isWebPAnimated,
};

function isWebp(imageDataView: DataView): boolean {
  // This just checks for WebP signature. "RIFF" followed by "WEBP"
  return (
    imageDataView.byteLength >= 12 &&
    imageDataView.getUint32(0, false) === 0x52494646 &&
    imageDataView.getUint32(8, false) === 0x57454250
  );
}

function getWebpDimensions(imageDataView: DataView): Dimensions {
  let width: number, height: number;
  // VP8 (lossy)
  if (imageDataView.getUint32(12, false) === 0x56503820) {
    // Move past the 'VP8 ' marker to the uncompressed data chunk.
    let offset = 12 + 4; // 4 bytes for 'VP8 ' marker

    // Attempt to find the key frame start code in the next bytes
    let found = false;
    for (let i = offset; i < Math.min(imageDataView.byteLength - 3, offset + 30); i++) {
      // Search up to 30 bytes ahead, but not beyond the buffer
      if (
        imageDataView.getUint8(i) === 0x9d &&
        imageDataView.getUint8(i + 1) === 0x01 &&
        imageDataView.getUint8(i + 2) === 0x2a
      ) {
        offset = i;
        found = true;
        break;
      }
    }

    if (found) {
      // Move past the keyframe start code.
      offset += 3;

      // Extract the width and height. They are little-endian.
      const rawWidth = imageDataView.getUint16(offset, true);
      const rawHeight = imageDataView.getUint16(offset + 2, true);

      // Mask out the lower 14 bits for the actual dimensions.
      width = rawWidth & 0x3fff;
      height = rawHeight & 0x3fff;
    }
  }
  // VP8L (lossless)
  else if (imageDataView.getUint32(12, false) === 0x5650384c) {
    // Get the 32 bits starting at the 22nd byte, but remember it's little-endian
    const bits = imageDataView.getUint32(21, true); // little-endian
    // Extract the width from the least 14 bits
    width = 1 + (bits & 0x3fff);
    // Extract the height from the next 14 bits
    height = 1 + ((bits >> 14) & 0x3fff);
  }
  // VP8X (extended)
  // Note: This won't give accurate dimensions for images with VP8X as it may contain multiple image chunks
  else if (imageDataView.getUint32(12, false) === 0x56503858) {
    // Extract width and height for the 'VP8X' chunk (big-endian)
    width =
      (imageDataView.getUint8(24) | // Fetch the 1st byte and consider it as is.
        (imageDataView.getUint8(25) << 8) | // Fetch the 2nd byte and left shift it by 8 bits.
        (imageDataView.getUint8(26) << 16)) + // Fetch the 3rd byte and left shift it by 16 bits.
      1; // Sum the results of the above three operations and add 1 to get the actual width.

    height =
      (imageDataView.getUint8(27) | // Fetch the 1st byte and consider it as is.
        (imageDataView.getUint8(28) << 8) | // Fetch the 2nd byte and left shift it by 8 bits.
        (imageDataView.getUint8(29) << 16)) + // Fetch the 3rd byte and left shift it by 16 bits.
      1; // Sum the results of the above three operations and add 1 to get the actual height.
  }
  return { width, height };
}

function isWebPAnimated(imageDataView: DataView): boolean {
  // Get the file size
  const fileSize = imageDataView.getUint32(4, true);

  // Find the ANIM chunk
  let offset = 12;
  while (offset < fileSize) {
    // Ensure there's enough data left for the chunk type and size (8 bytes)
    if (offset + 8 > imageDataView.byteLength) {
      break;
    }

    const chunkType = imageDataView.getUint32(offset, false);
    const chunkSize = imageDataView.getUint32(offset + 4, true);

    // Check if the current chunk is the ANIM chunk
    if (chunkType === 0x414e494d) {
      return true;
    }

    // Move to the next chunk
    offset += chunkSize + 8;
  }

  return false;
}
