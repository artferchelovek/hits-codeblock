export const getConnectorPos = (
  elementId: string,
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const el = document.getElementById(elementId);
  const container = containerRef.current;

  if (!el || !container) return null;

  const elRect = el.getBoundingClientRect();
  const contRect = container.getBoundingClientRect();

  return {
    x: elRect.left - contRect.left + elRect.width / 2,
    y: elRect.top - contRect.top + elRect.height / 2,
  };
};
