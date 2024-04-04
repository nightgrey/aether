import { useState, useEffect, useRef } from 'react';
import { getImageDimensions } from '~shared/image';
import { LRUCache } from '~shared/lru';

const cache = new LRUCache<File, { size: { width: number; height: number }; url: string }>(10, {
  key: (file) => `${file.name}-${file.size}`,
  onEvict: (_, value) => {
    URL.revokeObjectURL(value.url);
  },
});

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
        const cached = cache.get(file);
        if (cached !== undefined) {
          setSize(cached.size);
          urlRef.current = cached.url;
        } else {
          const set = cache.set(file, {
            size: await getImageDimensions(file),
            url: URL.createObjectURL(file),
          });

          setSize(set.size);
          urlRef.current = set.url;
        }
      }

      setIsSetting(false);
    };

    void compute();

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
