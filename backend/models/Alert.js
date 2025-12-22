import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    level: { 
        type: String, 
        enum: ["info", "warning", "critical"], 
        required: true 
    },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Alert", AlertSchema);