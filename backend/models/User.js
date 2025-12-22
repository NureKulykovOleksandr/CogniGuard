import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    rank: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["soldier", "commander", "medic", "admin"], 
        default: "soldier" 
    },
    unit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model("User", UserSchema);
