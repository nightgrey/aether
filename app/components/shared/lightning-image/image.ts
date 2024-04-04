export enum ImageType {
  JPEG = 'JPEG',
  PNG = 'PNG',
  GIF = 'GIF',
  WEBP = 'WEBP',
  AVIF = 'AVIF',
  BMP = 'BMP',
  TIFF = 'TIFF',
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface FormatHandler {
  type: ImageType;
  isValid: (data: DataView) => boolean;
  getDimensions: (data: DataView) => Dimensions;
  isAnimated: (data: DataView) => boolean;
}

export class ShortOfBytesError extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
