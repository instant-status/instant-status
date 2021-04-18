import { useEffect, useRef } from "react";
type Event = MouseEvent | TouchEvent;

export default function useClickAway(callback: () => void) {
  const ref = useRef(null);

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target)) callback();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener(`touchstart`, handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener(`touchstart`, handleClickOutside);
    };
  }, []);

  return ref;
}
