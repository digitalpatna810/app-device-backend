module.exports = {
    apps: [
        {
            name: "device-manager-backend",
            script: "./src/app.ts", // Path to your TypeScript entry file
            interpreter: "ts-node", // Use ts-node to execute TypeScript files
        },
    ],
};
