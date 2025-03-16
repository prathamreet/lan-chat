const WebSocket = require("ws");
const os = require("os");
const bonjour = require("bonjour")();
const clients = new Map();

const WS_PORT = 8080;

// Function to get local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address;
            }
        }
    }
    return "127.0.0.1";
}

const LOCAL_IP = getLocalIP();

// Start WebSocket Server
const wss = new WebSocket.Server({ host: LOCAL_IP, port: WS_PORT }, () => {
    console.log(`🚀 WebSocket Server running on ws://${LOCAL_IP}:${WS_PORT}`);
});

// Advertise the server using Bonjour for auto-discovery
bonjour.publish({ name: "LAN Chat Server", type: "ws", port: WS_PORT });

// Handle WebSocket connections
wss.on("connection", (ws, req) => {
    const clientIP = req.socket.remoteAddress.replace(/^.*:/, ""); // Remove IPv6 prefix
    const deviceName = os.hostname(); // Get the server's device name

    // Request client details (username, device name)
    ws.send(JSON.stringify({ type: "requestDetails" }));

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === "userDetails") {
                const username = data.username || `Guest-${clients.size + 1}`;
                clients.set(ws, { username, ip: clientIP });

                console.log(`🔗 New client connected: ${username} (${clientIP})`);
                console.log(`📟 Device: ${deviceName}`);
                console.log(`👥 Total clients connected: ${clients.size}`);

                // Notify all clients about the new connection
                broadcastMessage("system", `${username} joined the chat.`);
            } else if (data.type === "message") {
                const sender = clients.get(ws);
                if (sender) {
                    broadcastMessage(sender.username, data.text);
                }
            }
        } catch (error) {
            console.error("❌ Error processing message:", error);
        }
    });

    ws.on("close", () => {
        const client = clients.get(ws);
        if (client) {
            console.log(`❌ ${client.username} (${client.ip}) disconnected.`);
            clients.delete(ws);
            console.log(`👥 Total clients connected: ${clients.size}`);
            broadcastMessage("system", `${client.username} left the chat.`);
        }
    });
});

// Broadcast message to all connected clients
function broadcastMessage(sender, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ sender, message }));
        }
    });
}
