import { Tensor as OnnxTensor } from './onnx';
import { type Tensor } from '@tensorflow/tfjs';
export { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
export {
  browser,
  tensor,
  min,
  type DataType,
  Tensor,
  max,
  concat,
  zeros,
  scalar,
  type TensorLike,
  reshape,
  tensor3d,
  type Tensor3D,
  backend,
  setBackend,
  ready,
  getBackend,
} from '@tensorflow/tfjs';

export const toOnnx = async (tensor: Tensor) => {
  const data = await tensor.data();

  if (tensor.dtype === 'complex64') {
    throw new Error(`Unsupported tensor data type.`);
  }

  return new OnnxTensor(tensor.dtype, data, tensor.shape);
};
