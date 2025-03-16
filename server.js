const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
    console.log(`🔗 New Client Connected: ${req.socket.remoteAddress}`);

    ws.on("message", (message) => {
        console.log(`📩 Message received: ${message}`);

        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("🔴 Client Disconnected"));
});

console.log("✅ WebSocket server running on ws://localhost:8080");
