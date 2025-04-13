import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log("Received:", message.toString());
        ws.send(`Echo: ${message}`);
    });

    ws.send("Welcome to the server");
});
