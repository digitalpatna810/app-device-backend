import express, { Express } from "express";
import profileRoutes from "./routes/profile-route";
import authRoutes from "./routes/auth-route";
import adminRoutes from "./routes/admin-route";
import postRoute from "./routes/post-route";
import contactsRoutes from "./routes/contacts-route";
import notificationRoutes from "./routes/notification-route";
import dotenv from "dotenv";
import locationRoutes from "./routes/location-route"
import cors from "cors";
import connectDB from "./config/mongodb";
import swaggerDocs from './config/swagger';
import path from "path";
import mime from "mime-types";

const app : Express = express();

dotenv.config();
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  if (req.path.endsWith(".js")) {
    res.type(mime.lookup(req.path) || "application/javascript");
  }
  next();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
app.use("/api", profileRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", postRoute);
app.use("/api", contactsRoutes);
app.use("/api", notificationRoutes);
app.use("/api", locationRoutes);
swaggerDocs(app);
// console.log("hello");
app.use(cors({   origin: '*', 
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],                                                              
allowedHeaders: ['Content-Type', 'Authorization'], }));


app.use((req, res, next) => {  
   res.header("Access-Control-Allow-Origin", "*");   
   res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");  
 res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");   
 next(); })

const port = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
}).catch((err) => {
  console.log(err);
});