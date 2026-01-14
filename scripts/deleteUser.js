const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://danielminto:dj_Minto123%401@cluster1.mbt7tyl.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster1';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  profilePhoto: { type: String },
  address: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

async function deleteUser(email) {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log(`Deleting user with email: ${email}`);
    const result = await User.deleteOne({ email: email.toLowerCase() });
    
    if (result.deletedCount === 0) {
      console.log(`❌ User not found: ${email}`);
    } else {
      console.log(`✅ User deleted successfully: ${email}`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteUser('danielminto13@gmail.com');
