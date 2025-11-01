require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using URI:', process.env.MONGODB_URI.replace(/:([^:@]{4,}@)/, ':****@')); // Hide password in logs
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('\n✅ MongoDB Connected Successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    await mongoose.disconnect();
    console.log('\nConnection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error connecting to MongoDB:');
    console.error(error.message);
    process.exit(1);
  }
};

testConnection();