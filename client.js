const WebSocket = require("ws");
const readline = require("readline");

// Replace with your LAN IP if needed
const ws = new WebSocket("ws://10.151.22.104:8080");

ws.onopen = () => {
    console.log("✅ Connected to WebSocket server");

    // Allow user to type messages in terminal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt("💬 Enter message: ");
    rl.prompt();

    rl.on("line", (message) => {
        ws.send(message);
        console.log("📤 Sent:", message);
        rl.prompt();
    });

    ws.onclose = () => {
        console.log("🔴 Connection closed");
        rl.close();
    };
};

ws.onmessage = (msg) => console.log("📩 Message received:", msg.data.toString());
ws.onerror = (err) => console.log("❌ WebSocket Error:", err);
