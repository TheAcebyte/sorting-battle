export function enablePanning(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  let isPanning = false;
  let lastX = 0;

  canvas.addEventListener("pointerdown", (event) => {
    isPanning = true;
    lastX = event.x;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!isPanning) return;
    const dx = event.x - lastX;
    ctx.translate(dx, 0);
    lastX = event.x;
  });

  canvas.addEventListener("pointerup", (event) => {
    isPanning = false;
    canvas.releasePointerCapture(event.pointerId);
  });
}
