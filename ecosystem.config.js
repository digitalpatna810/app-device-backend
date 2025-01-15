module.exports = {
    apps: [
      {
        name: "my-lms-app",
        script: "app.ts", // Entry point
        interpreter: "ts-node", // Use ts-node for TypeScript
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  