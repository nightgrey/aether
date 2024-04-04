import React from 'react';

export const createContext = <T>(name: string) => {
  const defaultValue = Symbol(`Default value for "${name}"`);

  const Context = React.createContext<T | typeof defaultValue>(defaultValue);

  const useConsumer = () => {
    const context = React.useContext(Context);

    if (context === defaultValue) {
      throw new Error(`${name} context is missing.`);
    }

    return context;
  };

  return [Context, useConsumer, defaultValue] as const;
};
