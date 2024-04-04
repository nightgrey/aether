import { Check } from 'lucide-react';
export const HeroText = () => {
  return (
    <div className="grid grid-cols-2">
      <div>
        <h1 className="text-6xl font-extrabold">Remove the background from your images.</h1>
        <h2 className="text-3xl">... without data leaving your browser.</h2>
        <h2 className="flex space-x-3">
          {['Free', 'Secure', 'Local'].map((text) => (
            <span key={text}>
              <Check className="mr-1 inline-block" />
              {text}
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
};
