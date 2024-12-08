// server.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});