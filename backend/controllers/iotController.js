import IoTService from "../services/iotService.js";

export const saveData = async (req, res) => {
    try {
        // Логіка перевірки
        const savedData = await IoTService.processData(req.body);
        res.status(200).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getLatest = async (req, res) => {
    try {
        const { userId } = req.params;
        // Викликаємо сервіс
        const data = await IoTService.getLatestData(userId);
        
        if (!data) {
            return res.status(404).json({ message: "Дані для цього бійця ще не надходили" });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера", error });
    }
};

