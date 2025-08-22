import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    fullName: { type: String },
    address: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' }
});

export const UserModel = mongoose.model('User', userSchema);
