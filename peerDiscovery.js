const dgram = require("dgram");
const os = require("os");

const BROADCAST_PORT = 12345;
const BROADCAST_INTERVAL = 2000; // Every 2 seconds
const socket = dgram.createSocket("udp4");

// Get LAN IP Address
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (let iface in interfaces) {
        for (let config of interfaces[iface]) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address;
            }
        }
    }
    return "127.0.0.1"; // Fallback to localhost
}

// Get System Name
const systemName = os.hostname();  // Gets the system's hostname

// Custom Peer Name (Change this for each user)
const customPeerName = "Electro"; // Set your own name here

const localIP = getLocalIp();

// **Broadcast Your Details**
setInterval(() => {
    const message = Buffer.from(`PEER_DISCOVERY|${localIP}|${systemName}|${customPeerName}`);
    socket.send(message, 0, message.length, BROADCAST_PORT, "255.255.255.255");
    console.log(`📢 Broadcasting as ${customPeerName} (${systemName}) @ ${localIP}`);
}, BROADCAST_INTERVAL);

// **Listen for Other Peers**
socket.on("message", (msg, rinfo) => {
    const message = msg.toString();
    if (message.startsWith("PEER_DISCOVERY|")) {
        const parts = message.split("|");
        const peerIP = parts[1];
        const peerSystem = parts[2];
        const peerName = parts[3];

        if (peerIP !== localIP) {
            console.log(`👀 Found Peer: ${peerName} (${peerSystem}) @ ${peerIP}`);
        }
    }
});

// **Enable Broadcasting**
socket.bind(BROADCAST_PORT, () => {
    socket.setBroadcast(true);
    console.log("🔍 Listening for peers...");
});
