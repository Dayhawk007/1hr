import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { userRouter } from './routes/user.js';
import { adminRouter } from './routes/admin.js';

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


// Routes will go here
console.log("User route declared");

app.use("/api/user",userRouter);

console.log("Admin route declared");

app.use("/api/admin",adminRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
