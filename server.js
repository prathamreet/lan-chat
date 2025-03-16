const WebSocket = require("ws");
const bonjour = require("bonjour")();
const os = require("os");

const PORT = 8080;
const clients = new Map(); // Store clients with their details

// Advertise WebSocket server using Bonjour for automatic discovery
bonjour.publish({ name: "LAN Chat", type: "ws", port: PORT });

// Start WebSocket Server
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 WebSocket Server running on ws://${os.hostname()}:${PORT}`);

wss.on("connection", (ws, req) => {
    const clientIP = req.socket.remoteAddress.replace("::ffff:", ""); // Remove IPv6 prefix

    // Handle incoming messages
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);

            if (msg.type === "userDetails") {
                // Save client details (username, device name, IP)
                clients.set(ws, {
                    username: msg.username || "Unknown",
                    device: msg.device || "Unknown Device",
                    ip: clientIP,
                });

                console.log(`🔗 New client connected: ${msg.username} (${msg.device}) [${clientIP}]`);
                broadcastClientCount();
            } else if (msg.type === "message") {
                // Send message with username
                const clientInfo = clients.get(ws);
                if (clientInfo) {
                    broadcastMessage(clientInfo.username, msg.text);
                }
            }
        } catch (error) {
            console.error("❌ Error processing message:", error);
        }
    });

    ws.on("close", () => {
        const clientInfo = clients.get(ws);
        if (clientInfo) {
            console.log(`❌ Client disconnected: ${clientInfo.username} (${clientInfo.device}) [${clientInfo.ip}]`);
            clients.delete(ws);
            broadcastClientCount();
        }
    });
});

// Broadcast message to all clients
function broadcastMessage(sender, message) {
    const data = JSON.stringify({ type: "message", sender, message });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Broadcast total client count
function broadcastClientCount() {
    console.log(`👥 Total clients connected: ${clients.size}`);
}
