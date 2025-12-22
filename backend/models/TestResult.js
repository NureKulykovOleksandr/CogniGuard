import mongoose from "mongoose";

const TestResultSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    test_type: { 
        type: String, 
        enum: ["PVT", "n-back"], 
        required: true 
    },
    reaction_time_ms: { type: Number, required: true },
    errors_count: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ["normal", "fatigue", "critical"], 
        default: "normal" 
    },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("TestResult", TestResultSchema);
