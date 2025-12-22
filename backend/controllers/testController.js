import TestResult from "../models/TestResult.js"; // Цей імпорт залишаємо для deleteTest та getHistory
import TestService from "../services/testService.js"; 

// Збереження тесту
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

// Статистика по підрозділу
export const getUnitStats = async (req, res) => {
    try {
        const { unitId } = req.params;
        const stats = await TestService.getUnitStatistics(unitId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error calculating stats", error });
    }
};

// Історія
export const getHistory = async (req, res) => {
    try {
        const tests = await TestResult.find().sort({ timestamp: -1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error });
    }
};

// Видалення тесту
export const deleteTest = async (req, res) => {
    try {
        await TestResult.findByIdAndDelete(req.params.id);
        res.json({ message: "Тест видалено" });
    } catch (error) {
        res.status(500).json(error);
    }
};