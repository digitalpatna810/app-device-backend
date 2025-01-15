module.exports = {
    apps: [
        {
            name: "device-manager-backend",
            script: "./src/app.ts", // TypeScript entry file
            interpreter: "node", // Use Node.js as the interpreter
            args: "-r ts-node/register", // Register ts-node for TypeScript support
        },
    ],
};
