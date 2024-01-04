import { createEventListener } from "@solid-primitives/event-listener";

export const handleDragScrolling = (element: HTMLDivElement | undefined) => {
  if (!element) return;
  let startX: number;
  let startY: number;
  let isDragging = false;

  createEventListener(
    element,
    "mousedown",
    (event: MouseEvent) => {
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
    },
    { passive: true }
  );
  createEventListener(
    element,
    "mousemove",
    (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      element.scrollLeft -= deltaX;
      element.scrollTop -= deltaY;

      startX = event.clientX;
      startY = event.clientY;
    },
    { passive: true }
  );
  createEventListener(
    element,
    "mouseup",
    () => {
      isDragging = false;
    },
    { passive: true }
  );
};

export const centerContainer = (element: HTMLDivElement | undefined) => {
  if (!element) return;
  const { clientWidth, clientHeight } = element;
  const { scrollWidth, scrollHeight } = element;
  element.scrollLeft = scrollWidth / 2 - clientWidth / 2;
  element.scrollTop = scrollHeight / 2 - clientHeight / 2;
};
