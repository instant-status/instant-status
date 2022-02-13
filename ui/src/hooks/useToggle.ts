import { useCallback, useState } from "react";

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback((override?: boolean) => {
    setValue((value) => (override !== undefined ? override : !value));
  }, []);

  return [value, toggle] as [boolean, (override?: boolean) => void];
};

export default useToggle;
