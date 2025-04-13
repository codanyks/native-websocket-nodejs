const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", () => {
    console.log("Connected to server");
    ws.send("Hello from native client!");
});

ws.addEventListener("message", (event) => {
    console.log("Received from server:", event.data);
});
