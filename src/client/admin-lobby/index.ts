const button = document.getElementById("button-login")!;
const input = document.getElementById("input-password")! as HTMLInputElement;

button.addEventListener("click", async () => {
  const password = input.value;
  await fetch("/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
});
