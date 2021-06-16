import { useRef, useEffect } from "react";

function createRootElement(id: string) {
  const rootContainer = document.createElement("div");
  rootContainer.setAttribute("id", id);
  return rootContainer;
}

function addRootElement(rootElement: Element) {
  if (document.body.lastElementChild) {
    document.body.insertBefore(
      rootElement,
      document.body.lastElementChild.nextElementSibling,
    );
  }
}

function usePortal(id: string) {
  const rootElementRef = useRef<HTMLElement | null>(null);

  useEffect(
    function setupElement() {
      // Look for existing target dom element to append to
      const existingParent = document.querySelector(`#${id}`);
      // Parent is either a new root or the existing dom element
      const parentElement = existingParent || createRootElement(id);

      // If there is no existing DOM element, add a new one.
      if (!existingParent) {
        addRootElement(parentElement);
      }

      // Add the detached element to the parent
      if (rootElementRef.current) {
        parentElement.appendChild(rootElementRef.current);
      }

      return function removeElement() {
        if (rootElementRef.current) {
          rootElementRef.current.remove();
          if (!parentElement.childElementCount) {
            parentElement.remove();
          }
        }
      };
    },
    [id],
  );

  /**
   * It's important we evaluate this lazily:
   * - We need first render to contain the DOM element, so it shouldn't happen
   *   in useEffect. We would normally put this in the constructor().
   * - We can't do 'const rootElementRef = useRef(document.createElement('div))',
   *   since this will run every single render (that's a lot).
   * - We want the ref to consistently point to the same DOM element and only
   *   ever run once.
   * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
   */
  function getRootElement() {
    if (!rootElementRef.current) {
      rootElementRef.current = document.createElement("div");
    }
    return rootElementRef.current;
  }

  return getRootElement();
}

export default usePortal;
