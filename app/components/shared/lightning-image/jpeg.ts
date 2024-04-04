import { type Dimensions, type FormatHandler, ImageType } from './image';

// This object is used to dynamically import the format handlers
export const jpegHandler: FormatHandler = {
  type: ImageType.JPEG,
  isValid: isJpeg,
  getDimensions: getJpegDimensions,
  isAnimated: () => false,
};

function isJpeg(imageDataView: DataView): boolean {
  // Check the signature for a JPEG image
  // JPEG images start with the two-byte sequence: 0xffd8
  return imageDataView.getUint16(0, false) === 0xffd8;
}

function getJpegDimensions(imageDataView: DataView): Dimensions | undefined {
  // Start immediately after the JPEG signature
  let i = 2;

  // Iterate through the bytes of the image
  while (i < imageDataView.byteLength) {
    // Look for a marker (0xFF byte)
    if (imageDataView.getUint8(i) === 0xff) {
      // Check for Start of Frame (SOF) markers which indicate the start of image data
      // SOF markers range from 0xC0 to 0xCF (excluding 0xC4, which is the DHT marker)
      if (
        imageDataView.getUint8(i + 1) >= 0xc0 &&
        imageDataView.getUint8(i + 1) <= 0xcf &&
        imageDataView.getUint8(i + 1) !== 0xc4
      ) {
        // If an SOF marker is found, extract image dimensions
        // The height is at an offset of 5 bytes from the marker, and the width is at an offset of 7 bytes
        const height = imageDataView.getUint16(i + 5, false);
        const width = imageDataView.getUint16(i + 7, false);
        // Exit the loop once dimensions are found
        return { width, height };
      }
    }
    i++;
  }
  return { width: 0, height: 0 }; // If dimensions not found
}
