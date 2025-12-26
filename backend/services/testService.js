import TestResult from "../models/TestResult.js";
import User from "../models/User.js";
import Alert from "../models/Alert.js";

class TestService {
    // Логіка визначення статусу
    calculateStatus(reactionTime, errors) {
        if (reactionTime > 500 || errors > 3) return "critical";
        if (reactionTime > 350 || errors > 1) return "fatigue";
        return "normal";
    }
    
    // Збереження з перевіркою на Alert
    async saveTestResult(data) {
        const { user_id, test_type, reaction_time_ms, errors_count } = data;
        
        // Рахуємо статус
        const status = this.calculateStatus(reaction_time_ms, errors_count);

        // Зберігаємо тест
        const newTest = new TestResult({
            user_id,
            test_type,
            reaction_time_ms,
            errors_count,
            status
        });
        await newTest.save();

        // Якщо статус критичний - створюємо Alert
        if (status === "critical") {
            const newAlert = new Alert({
                user_id,
                level: "critical",
                message: `Боєць показав критичний рівень втоми! (Реакція: ${reaction_time_ms}мс)`
            });
            await newAlert.save();
        }

        return { newTest, status };
    }

    // Аналітика по підрозділу
    async getUnitStatistics(unitId) {
        // Знаходимо всіх бійців підрозділу
        const soldiers = await User.find({ unit_id: unitId }).select('_id');
        const soldierIds = soldiers.map(s => s._id);

        // Агрегація даних за останні 7 днів
        const stats = await TestResult.aggregate([
            { $match: { user_id: { $in: soldierIds } } },
            {
                $group: {
                    _id: null,
                    avgReactionTime: { $avg: "$reaction_time_ms" },
                    totalErrors: { $sum: "$errors_count" },
                    criticalCases: { 
                        $sum: { $cond: [{ $eq: ["$status", "critical"] }, 1, 0] } 
                    }
                }
            }
        ]);

        return stats[0] || { avgReactionTime: 0, totalErrors: 0, criticalCases: 0 };
    }
}

export default new TestService();