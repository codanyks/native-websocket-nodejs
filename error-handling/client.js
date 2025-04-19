const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "demo", password: "pass" }),
});

const { token } = await res.json();

function setSocket(token) {
    return new Promise((resolve, reject) => {
        try {
            let isResolved = false;
            const ws = new WebSocket(`ws://localhost:8080`);

            ws.addEventListener("open", () => {
                console.log("Connected to server");
                const message = JSON.stringify({
                    token,
                    data: "Hello from native client!",
                });
                ws.send(message);
                isResolved = true;
                resolve(true);
            });

            ws.addEventListener("message", (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    console.log("Received from server:", parsed.message);
                } catch (e) {
                    ws.send(JSON.stringify({ error: "Invalid JSON" }));
                }
            });

            ws.addEventListener("error", () => {
                console.log("SetSocketError: WebSocket encountered an error.");
                if (isResolved) {
                    retryConnection(token);
                } else {
                    resolve(false); // Signal failure to trigger retry
                }
            });

            ws.addEventListener("close", () => {
                console.log("SetSocketClosed: Closed from server.", isResolved);
                if (isResolved) {
                    retryConnection(token);
                } else {
                    resolve(false); // Signal failure to trigger retry
                }
            });
        } catch (e) {
            console.log(
                "SetSocketException: Error connecting to server:",
                JSON.stringify(e)
            );
            resolve(false);
        }
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryConnection(token, retries = 5) {
    let delay = 1000;

    async function attempt(retry) {
        console.log(`Attempt: ${retry}`);
        if (retry === 0) {
            console.log("Retry attempts exhausted.");
            return;
        }

        const connected = await setSocket(token);
        if (!connected) {
            console.log(`Retrying in ${delay} ms...`);
            await sleep(delay); // <-- await the delay
            delay *= 2; // Exponential backoff
            await attempt(retry - 1); // <-- await the next attempt
        }
    }

    await attempt(retries);
}

retryConnection(token);
