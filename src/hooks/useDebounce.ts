import { useEffect, useState } from "react";

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const intervalId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(intervalId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
