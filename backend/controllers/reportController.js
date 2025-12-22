import Report from "../models/Report.js";

export const generateReport = async (req, res) => {
    try {
        // Створюємо імітацію звіту
        const newReport = new Report({
            ...req.body,
            file_url: "https://example.com/report-123.pdf"
        });
        await newReport.save();
        res.status(200).json(newReport);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getReports = async (req, res) => {
    const reports = await Report.find();
    res.json(reports);
};

export const deleteReport = async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: "Звіт видалено" });
    } catch (error) {
        res.status(500).json(error);
    }
};