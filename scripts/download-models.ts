import { $ } from 'bun';

const urls = [
  'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx?download=true',
  'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model_fp16.onnx?download=true',
  'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model_quantized.onnx?download=true',
];

for (const url of urls) {
  await $`curl -L ${url} -OJ public/rmbg/`;
}
