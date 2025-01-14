import express, { Express } from "express";
import profileRoutes from "./routes/profile-route";
import authRoutes from "./routes/auth-route";
import adminRoutes from "./routes/admin-route";
import postRoute from "./routes/post-route";
import contactsRoutes from "./routes/contacts-route";
import notificationRoutes from "./routes/notification-route";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb";
import swaggerDocs from './config/swagger';

const app : Express = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api", profileRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", postRoute);
app.use("/api", contactsRoutes);
app.use("/api", notificationRoutes);

swaggerDocs(app);

const port = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
}).catch((err) => {
  console.log(err);
});