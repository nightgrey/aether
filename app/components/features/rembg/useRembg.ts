import { useState } from 'react';
import { inference as originalInference } from './inference';
import { useFile } from '~shared/useFile';
import { blobToFile, getImageDimensions } from '~shared/image';

export const useRembg = () => {
  const [isInferencing, setIsInferencing] = useState(false);
  const [output, setOutput, { url, size }] = useFile();
  const [error, setError] = useState<unknown>(null);

  const inference = async (
    input: Parameters<typeof originalInference>[0],
    type?: Parameters<typeof originalInference>[2],
  ) => {
    setIsInferencing(true);

    const result = await originalInference(input, await getImageDimensions(input), type);
    console.log(result);

    if (result.error != null) {
      setError(result.error);
      setOutput(null);
    } else if (result.output === null) {
      setError(new Error('No output.'));
      setOutput(null);
    } else {
      setOutput(await blobToFile(result.output.blob));
      setError(null);
    }

    setIsInferencing(false);

    return result;
  };

  return [
    output,
    setOutput,
    inference,
    {
      error,
      url,
      size,
      isInferencing,
    },
  ] as const;
};
