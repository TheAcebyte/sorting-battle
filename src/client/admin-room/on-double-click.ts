const DOUBLE_CLICK_THRESHOLD = 250;

export function onDoubleClick(element: HTMLElement, callback: () => void) {
  let lastTimestamp = 0;
  element.addEventListener("pointerdown", () => {
    const timestamp = performance.now();
    console.log(timestamp - lastTimestamp);
    if (timestamp - lastTimestamp <= DOUBLE_CLICK_THRESHOLD) {
      callback();
    }

    lastTimestamp = timestamp;
  });
}
