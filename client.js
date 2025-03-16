const WebSocket = require("ws");
const bonjour = require("bonjour")();
const readline = require("readline");

// Create a readline interface for terminal input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Auto-discover WebSocket server
bonjour.find({ type: "ws" }, (service) => {
    const serverIp = service.referer.address;
    console.log(`✅ Found server at ws://${serverIp}:8080`);

    const ws = new WebSocket(`ws://${serverIp}:8080`);

    ws.on("open", () => {
        console.log("🔗 Connected to server! Type a message and press Enter to send.");

        // Start interactive chat
        rl.on("line", (message) => {
            if (message.toLowerCase() === "exit") {
                console.log("🔴 Closing connection...");
                ws.close();
                rl.close();
                return;
            }
            ws.send(message);
        });
    });

    ws.on("message", (data) => {
        const message = data.toString();
        readline.clearLine(process.stdout, 0); // Clear input line
        readline.cursorTo(process.stdout, 0);  // Move cursor to start
        console.log(`📩 ${message}`);
        rl.prompt(true); // Restore prompt
    });

    ws.on("close", () => {
        console.log("🔴 Disconnected from server");
        rl.close();
    });

    ws.on("error", (err) => console.error("❌ Connection error:", err));
});
