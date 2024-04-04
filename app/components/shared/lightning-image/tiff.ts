import { type Dimensions, type FormatHandler, ImageType, ShortOfBytesError } from './image';

// This object is used to dynamically import the format handlers
export const tiffHandler: FormatHandler = {
  type: ImageType.TIFF,
  isValid: isTiff,
  getDimensions: getTiffDimensions,
  isAnimated: () => false,
};

function isTiff(imageDataView: DataView): boolean {
  const signature = imageDataView.getUint16(0, false);
  return imageDataView.byteLength > 2 && (signature === 0x4949 || signature === 0x4d4d);
}

function getTiffDimensions(imageDataView: DataView): Dimensions {
  const littleEndian = isLittleEndian(imageDataView);
  const ifdOffset = imageDataView.getUint32(4, littleEndian);
  // Compressed or uncompressed image data can be stored almost anywhere in a
  // TIFF file. The TIFF format is organized into image file directories (IFDs).
  if (ifdOffset > imageDataView.byteLength) {
    throw new ShortOfBytesError();
  }

  return extractDimensionsFromIFD(imageDataView, ifdOffset, littleEndian);
}

function isLittleEndian(imageDataView: DataView): boolean {
  return imageDataView.getUint16(0, false) === 0x4949;
}

function extractDimensionsFromIFD(imageDataView: DataView, ifdOffset: number, littleEndian: boolean): Dimensions {
  const entries = imageDataView.getUint16(ifdOffset, littleEndian);
  let width = 0;
  let height = 0;

  for (let i = 0; i < entries; i++) {
    const entryOffset = ifdOffset + 2 + i * 12;
    const { tag, type, count, valueOffset } = extractIFDEntry(imageDataView, entryOffset, littleEndian);

    if (type === 3 && count === 1) {
      // It's a short, value is inline
      if (tag === 256) {
        width = valueOffset;
      }
      if (tag === 257) {
        height = valueOffset;
      }
      if (width && height) {
        return { width, height };
      }
    }
  }

  return { width, height };
}

function extractIFDEntry(imageDataView: DataView, entryOffset: number, littleEndian: boolean) {
  const tag = imageDataView.getUint16(entryOffset, littleEndian);
  const type = imageDataView.getUint16(entryOffset + 2, littleEndian);
  const count = imageDataView.getUint32(entryOffset + 4, littleEndian);
  const valueOffset = imageDataView.getUint16(entryOffset + 8, littleEndian);

  return { tag, type, count, valueOffset };
}
