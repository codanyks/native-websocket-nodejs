import express from "express";
import { UNAUTHORIZED } from "http-response-status-code";
import { WebSocketServer } from "ws";
import url from "url";

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

wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(url.parse(req.url).query);
    const token = params.get("authToken");

    if (!validateToken(token)) {
        ws.close(1008, "Unauthorized");
        return;
    }

    ws.on("message", (msg) => {
        console.log("Query Token Message:", msg.toString());
        ws.send("Hello from native server!")
    });
});

function validateToken(token) {
    return token === "secret123"; // mock validation
}
