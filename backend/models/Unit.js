import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model("Unit", UnitSchema);
