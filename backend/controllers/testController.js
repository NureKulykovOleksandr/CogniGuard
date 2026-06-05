import TestResult from "../models/TestResult.js"; 
import TestService from "../services/testService.js"; 

export const saveTestResult = async (req, res) => {
    try {
        const result = await TestService.saveTestResult(req.body);

        res.status(201).json({
            message: "Test saved",
            computed_status: result.status,
            data: result.newTest
        });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

export const getUnitStats = async (req, res) => {
    try {
        const { unitId } = req.params;
        const stats = await TestService.getUnitStatistics(unitId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error calculating stats", error });
    }
};

export const getHistory = async (req, res) => {
    try {
        const filter = req.query.user_id ? { user_id: req.query.user_id } : {};
        const tests = await TestResult.find(filter).sort({ timestamp: -1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error });
    }
};

export const deleteTest = async (req, res) => {
    try {
        await TestResult.findByIdAndDelete(req.params.id);
        res.json({ message: "Тест видалено" });
    } catch (error) {
        res.status(500).json(error);
    }
};