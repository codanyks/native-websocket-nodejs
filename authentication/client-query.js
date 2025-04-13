const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "demo", password: "passs" }),
});

const { token } = await res.json();

const ws = new WebSocket(`ws://localhost:8080?authToken=${token}`);

ws.addEventListener("open", () => {
    console.log("Connected to server");
    ws.send("Hello from native client!");
});

ws.addEventListener("message", (event) => {
    console.log("Received from server:", event.data);
});

ws.addEventListener("close", () => {
    console.log("Closed from server.");
});
