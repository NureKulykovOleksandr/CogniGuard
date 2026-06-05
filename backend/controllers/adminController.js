import User from "../models/User.js";
import TestResult from "../models/TestResult.js";
import IoTData from "../models/IoTData.js";
import fs from "fs";
import path from "path";


// Експорт всієї бази даних у JSON
export const exportData = async (req, res) => {
    try {
        // Збираємо дані з усіх колекцій
        const users = await User.find();
        const tests = await TestResult.find();
        const iotData = await IoTData.find();

        const fullData = {
            exported_at: new Date(),
            system_version: "1.0.0",
            data: {
                users,
                tests,
                iotData
            }
        };

        // Відправляємо JSON файл клієнту (браузеру)
        res.header("Content-Type", "application/json");
        res.attachment("cogniguard-export.json");
        res.send(JSON.stringify(fullData, null, 2));
        
    } catch (error) {
        res.status(500).json({ message: "Export failed", error });
    }
};

// Створення резервної копії (Backup) на сервері
export const createBackup = async (req, res) => {
    try {
        const users = await User.find();
        const tests = await TestResult.find();
        
        // Формуємо об'єкт бекапу
        const backupData = JSON.stringify({ users, tests }, null, 2);
        
        // Генеруємо ім'я файлу з датою
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `backup-${timestamp}.json`;
        
        // Шлях до папки backups у корені проекту
        const backupPath = path.join(process.cwd(), 'backups');

        // Якщо папки немає - створюємо її
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath);
        }

        // Записуємо файл
        fs.writeFileSync(path.join(backupPath, fileName), backupData);

        res.json({ 
            message: "Backup created successfully", 
            file_name: fileName,
            path: backupPath 
        });
    } catch (error) {
        res.status(500).json({ message: "Backup failed", error });
    }
};

// Імпорт бази даних (Restore) з JSON
export const importData = async (req, res) => {
    try {
        const { users, tests, iotData } = req.body;
        
        if (users && Array.isArray(users)) {
            await User.deleteMany({});
            await User.insertMany(users);
        }
        
        if (tests && Array.isArray(tests)) {
            await TestResult.deleteMany({});
            await TestResult.insertMany(tests);
        }
        
        if (iotData && Array.isArray(iotData)) {
            await IoTData.deleteMany({});
            await IoTData.insertMany(iotData);
        }
        
        res.json({ message: "Database imported successfully" });
    } catch (error) {
        res.status(500).json({ message: "Import failed", error });
    }
};