

import express from "express";
import "dotenv/config";
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.use("/api/auth",authRoutes)
app.use("/api/books",bookRoutes)

// app.get("/", (req, res) => {
//   res.send("Bookworm API is running");
// });




app.listen(PORT ,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})


