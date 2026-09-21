export function onPan(element: HTMLElement, callback: (dx: number) => void) {
  let isPanning = false;
  let lastX = 0;

  element.addEventListener("pointerdown", (event) => {
    isPanning = true;
    lastX = event.x;
    element.setPointerCapture(event.pointerId);
  });

  element.addEventListener("pointermove", (event) => {
    if (!isPanning) return;
    const dx = event.x - lastX;
    callback(dx);
    lastX = event.x;
  });

  element.addEventListener("pointerup", (event) => {
    isPanning = false;
    element.releasePointerCapture(event.pointerId);
  });
}
