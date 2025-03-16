const WebSocket = require("ws");
const os = require("os");

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
    return "127.0.0.1"; // Fallback to localhost
}

const SERVER_IP = getLocalIP();
const SERVER_URL = `ws://${SERVER_IP}:8080`;

const peerName = "Electro"; // Set your name
const systemName = os.hostname(); // Get system name


console.log(`🔗 Connecting to ${SERVER_URL}...`);
const socket = new WebSocket(SERVER_URL);

socket.on("open", () => {
    console.log("✅ Connected to server");
    socket.send(`PEER_UPDATE|${peerName}|${systemName}`);
});

socket.on("message", (msg) => {
    console.log("📩 Server:", msg.toString());
});

socket.on("close", () => {
    console.log("❌ Disconnected from server");
});

// **Send test message from terminal**
process.stdin.on("data", (data) => {
    socket.send(data.toString().trim());
});
