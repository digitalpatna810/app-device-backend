// module.exports = {
//     apps: [
//       {
//         name: "device-manager-backend",
//         script: "src/app.ts",
//         watch: "true",
//         interpreter: "ts-node", // Use ts-node as the interpreter
//         env: {
//           NODE_ENV: "development",
//         },
//         env_production: {
//           NODE_ENV: "production",
//         },
//       },
//     ],
//   };
  
module.exports = {
  apps: [
    {
      name: "device-manager-backend",
      script: "src/app.ts",
      watch: true,  // Corrected the watch field to a boolean
      interpreter: "node_modules/.bin/ts-node", // Point to ts-node executable in node_modules
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
