import User from "../models/User.js";
import TestResult from "../models/TestResult.js";
import IoTData from "../models/IoTData.js";
import fs from "fs";
import path from "path";

export const exportData = async (req, res) => {
    try {
        
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

        
        res.header("Content-Type", "application/json");
        res.attachment("cogniguard-export.json");
        res.send(JSON.stringify(fullData, null, 2));
        
    } catch (error) {
        res.status(500).json({ message: "Export failed", error });
    }
};

export const createBackup = async (req, res) => {
    try {
        const users = await User.find();
        const tests = await TestResult.find();
        
        
        const backupData = JSON.stringify({ users, tests }, null, 2);
        
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `backup-${timestamp}.json`;
        
        
        const backupPath = path.join(process.cwd(), 'backups');

        
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath);
        }

        
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