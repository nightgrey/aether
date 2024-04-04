import { useState } from 'react';
import { inference as originalInference, loadModel as originalLoadModel, isModelLoaded } from './inference';
import { useFile } from '~shared/useFile';
import { imageDataToFile } from '~shared/image';

export const useRembg = () => {
  const [isInferencing, setIsInferencing] = useState(false);
  const [output, setOutput, { url, size }] = useFile();
  const [error, setError] = useState<unknown>(null);

  const inference = async (
    input: Parameters<typeof originalInference>[0],
    type?: Parameters<typeof originalInference>[1],
  ) => {
    setIsInferencing(true);

    const result = await originalInference(input, type);

    if (result.error != null) {
      setError(result.error);
      setOutput(null);
    } else if (result.output === null) {
      setError(new Error('No output.'));
      setOutput(null);
    } else {
      setOutput(await imageDataToFile(result.output));
      setError(null);
    }

    setIsInferencing(false);

    return result;
  };

  const loadModel = async (type: Parameters<typeof originalLoadModel>[0]) => {
    setIsInferencing(true);
    await originalLoadModel(type);
    setIsInferencing(false);
  };

  return [
    output,
    setOutput,
    inference,
    loadModel,
    isModelLoaded,
    {
      error,
      url,
      size,
      isInferencing,
    },
  ] as const;
};
