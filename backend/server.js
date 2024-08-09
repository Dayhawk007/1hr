import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { userRouter } from './routes/user.js';
import { adminRouter } from './routes/admin.js';
import { clientsRouter } from './routes/clients.js';
import { subVendorsRouter } from './routes/sub-vendor..js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Middleware
app.use(express.json());

app.use(cors());


// Routes will go here
console.log("User route declared");

app.use("/api/user",userRouter);

app.use("/api/client",clientsRouter);

app.use("/api/sub-vendor",subVendorsRouter)

console.log("Admin route declared");

app.use("/api/admin",adminRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
