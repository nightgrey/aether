import { type Tensor, RawImage } from '@xenova/transformers';

const min = (t: Tensor) => {
  let min = t.data[0];

  for (let i = 1; i < t.data.length; ++i) {
    if (t.data[i] < min) {
      min = t.data[i];
    }
  }
  return min;
};
const max = (t: Tensor) => {
  let max = t.data[0];
  for (let i = 1; i < t.data.length; ++i) {
    if (t.data[i] > max) {
      max = t.data[i];
    }
  }
  return Number(max);
};
export const normalize = (t: Tensor) => {
  const minValue = min(t);
  const maxValue = max(t);
  t = t.clone();
  for (let i = 0; i < t.data.length; ++i) {
    t.data[i] = (t.data[i] - minValue) / (maxValue - minValue);
  }
  return t;
};

export const maskToRgba = (t: Tensor) => {
  const rgba = new Uint8ClampedArray(1024 * 1024 * 4);

  for (let i = 0, offset = 0; i < t.data.length; ++i) {
    rgba[offset++] = 0;
    rgba[offset++] = 0;
    rgba[offset++] = 0;
    rgba[offset++] = t.data[i] * 255;
  }

  console.log(t.data.filter((v) => v < 0.9));

  return rgba;
};

export const resize = async (data: Uint8ClampedArray, size: [width: number, height: number]) => {
  return Uint8ClampedArray.from((await new RawImage(data, 1024, 1024, 4).resize(...size)).data);
};
