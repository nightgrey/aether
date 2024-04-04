import { useState, useEffect, useRef } from 'react';
import { getImageDimensions } from '~shared/image';

export const useFile = (initialState: File | null = null) => {
  const urlRef = useRef<string | undefined>(undefined);

  const [isSettling, setIsSetting] = useState(false);

  const [file, setFile] = useState<File | null>(initialState);
  const [size, setSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const compute = async () => {
      setIsSetting(true);

      if (file === null) {
        setSize({
          width: undefined,
          height: undefined,
        });
        urlRef.current = undefined;
      } else {
        const size = await getImageDimensions(file);
        const newUrl = URL.createObjectURL(file);
        setSize(size);
        urlRef.current = newUrl;

        console.log(size, newUrl);
      }

      setIsSetting(false);
    };

    compute();

    return () => {
      urlRef.current = undefined;
    };
  }, [file]);

  return [
    file,
    setFile,
    {
      isSettling,
      size,
      url: urlRef.current,
    },
  ] as const;
};

export type UseFileReturn = ReturnType<typeof useFile>;
