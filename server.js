const WebSocket = require("ws");
const bonjour = require("bonjour")();
const os = require("os");

const WS_PORT = 8080;

// Function to get the local IP address
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
const wss = new WebSocket.Server({ host: LOCAL_IP, port: WS_PORT });
console.log(`🚀 WebSocket Server running on ws://${LOCAL_IP}:${WS_PORT}`);

// Bonjour Service Advertisement
bonjour.publish({ name: "LAN Chat", type: "ws", port: WS_PORT });

wss.on("connection", (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`🔗 New client connected: ${clientIP}`);

    ws.on("message", (message) => {
        const msg = message.toString().trim(); // Ensure message is string & remove extra spaces

        if (!msg) {
            console.log(`⚠️ Received an empty message from ${clientIP}`);
            return;
        }

        console.log(`📩 Message from ${clientIP}: ${msg}`);

        // Send message to other clients, not the sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    });

    ws.on("close", () => console.log(`❌ Client disconnected: ${clientIP}`));
});
