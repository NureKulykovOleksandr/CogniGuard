import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    unit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    summary_text: { type: String },
    file_url: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at' } });

export default mongoose.model("Report", ReportSchema);
