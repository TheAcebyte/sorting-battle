const button = document.getElementById("button-login")!;
const input = document.getElementById("input-password")! as HTMLInputElement;

function animateShake(element: HTMLElement) {
  const duration = 250;
  const keyframes = [
    { translate: "0 0", offset: 0.0 },
    { translate: "-4px 0", offset: 0.2 },
    { translate: "4px 0", offset: 0.4 },
    { translate: "-3px 0", offset: 0.6 },
    { translate: "2px 0", offset: 0.8 },
    { translate: "0 0", offset: 1.0 },
  ];

  element.animate(keyframes, { duration });
}

button.addEventListener("click", async () => {
  const password = input.value;
  const response = await fetch("/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (response.ok) {
    window.location.href = "/admin-room";
  } else if (password.length > 0) {
    animateShake(input);
  }
});
