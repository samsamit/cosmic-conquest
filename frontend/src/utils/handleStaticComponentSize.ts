export const handleStaticComponentSize = (component: HTMLDivElement) => {
  const parent = component.parentElement;
  if (parent) {
    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;
    component.style.width = `${parentWidth}px`;
    component.style.height = `${parentHeight}px`;
  }
};
