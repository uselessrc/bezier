import {useEffect, useState} from 'react';

type NamedState<TName extends string, TValue> = {
  [k in TName]: TValue;
} &
  {
    [k in `set${Capitalize<TName>}`]: (val: TValue) => void;
  };

export function useNamedState<TName extends string, TValue>(
  name: TName,
  def?: TValue,
): NamedState<TName, TValue> {
  const [val, setter] = useState(def);

  return {
    [name]: val,
    [`set${name[0].toUpperCase()}${name.slice(1)}`]: setter,
  } as NamedState<TName, TValue>;
}

export const useDocumentEvent = (
  event: keyof DocumentEventMap,
  callback: any,
): void => {
  useEffect(() => {
    document.addEventListener(event, callback);
    return () => document.removeEventListener(event, callback);
  }, [event, callback]);
};
