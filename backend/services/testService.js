import TestResult from "../models/TestResult.js";
import User from "../models/User.js";
import Alert from "../models/Alert.js";

class TestService {
    
    calculateStatus(testType, reactionTime, errors) {
        if (testType === 'n-back') {
            if (reactionTime > 1500 || errors > 5) return "critical";
            if (reactionTime > 1000 || errors > 2) return "fatigue";
            return "normal";
        }
        
        if (reactionTime > 500 || errors > 3) return "critical";
        if (reactionTime > 350 || errors > 1) return "fatigue";
        return "normal";
    }
    
    
    async saveTestResult(data) {
        const { user_id, test_type, reaction_time_ms, errors_count } = data;
        
        
        const status = this.calculateStatus(test_type, reaction_time_ms, errors_count);

        
        const newTest = new TestResult({
            user_id,
            test_type,
            reaction_time_ms,
            errors_count,
            status
        });
        await newTest.save();

        
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

    
    async getUnitStatistics(unitId) {
        
        const soldiers = await User.find({ unit_id: unitId }).select('_id');
        const soldierIds = soldiers.map(s => s._id);

        
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