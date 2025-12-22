import mongoose from "mongoose";

const IoTDataSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pulse_rate: { type: Number, required: true },
    stress_level: { type: Number }, // Умовний рівень 1-100
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("IoTData", IoTDataSchema);
