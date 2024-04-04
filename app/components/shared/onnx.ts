import * as tf from './tf';
import { type Tensor as OnnxTensor } from 'onnxruntime-web/wasm';
import { env } from 'onnxruntime-web/wasm';
import { IS_CLIENT } from '~shared/platform';
export const toTf = async (tensor: OnnxTensor) => {
  const data = await tensor.getData();

  if (data instanceof BigInt64Array || data instanceof BigInt || data instanceof BigUint64Array) {
    throw new Error(`Unsupported tensor data type.`);
  }
  return tf.tensor(data, [...tensor.dims], tensor.type as tf.DataType);
};

// https://onnxruntime.ai/docs/api/js/interfaces/Env-1.html
// https://github.com/microsoft/onnxruntime-inference-examples/blob/main/js/api-usage_ort-env-flags/README.md
if (IS_CLIENT) {
  env.wasm.proxy = true;
  env.wasm.wasmPaths = `${window.location.origin}/onnx/`;
}
export { Tensor, InferenceSession, env } from 'onnxruntime-web/wasm';
