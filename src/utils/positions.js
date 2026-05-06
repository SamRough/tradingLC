export function getEntityCenter(element, sceneRect) {
  if (!element) return { x: 0, y: 0 };
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - sceneRect.left,
    y: rect.top + rect.height / 2 - sceneRect.top,
  };
}

export function getEntityPositions(entityRefs, sceneRef) {
  if (!sceneRef.current) return {};
  const sceneRect = sceneRef.current.getBoundingClientRect();
  const positions = {};
  for (const [key, el] of Object.entries(entityRefs.current)) {
    if (el) {
      positions[key] = getEntityCenter(el, sceneRect);
    }
  }
  return positions;
}
