import express from "express";
import { UNAUTHORIZED } from "http-response-status-code";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "demo" && password === "pass") {
        const token = "secret123"; // Replace with JWT in real apps
        res.json({ token });
    } else {
        res.status(UNAUTHORIZED).json({ error: "Invalid credentials" });
    }
});

app.listen(3000, () => console.log("Auth server running"));

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        let parsed;
        try {
            parsed = JSON.parse(msg);
        } catch (e) {
            ws.send("Invalid message format");
            return;
        }
        const { token, data } = parsed;
        if (!validateToken(token)) {
            ws.close(4001, "Unauthorized");
            return;
        }
        console.log("Received:", data);
        ws.send(`Echo: ${data}`);
    });
});

function validateToken(token) {
    return token === "secret123"; // mock validation
}
