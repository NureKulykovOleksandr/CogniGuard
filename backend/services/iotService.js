import IoTData from "../models/IoTData.js";

class IoTService {
    async processData(data) {
        const { user_id, pulse_rate, stress_level } = data;

        // Валідація (відсіювання шумів)
        if (pulse_rate < 30 || pulse_rate > 220) {
            throw new Error("Invalid Pulse Rate: Sensor Error");
        }
        if (stress_level < 0 || stress_level > 100) {
            throw new Error("Invalid Stress Level");
        }

        const newData = new IoTData({ user_id, pulse_rate, stress_level });
        return await newData.save();
    }
    async getLatestData(userId) {
        // Знайти один запис (.findOne), де user_id співпадає
        // Відсортувати за часом (.sort): -1 означає "від нових до старих"
        return await IoTData.findOne({ user_id: userId }).sort({ timestamp: -1 });
    }
}

export default new IoTService();