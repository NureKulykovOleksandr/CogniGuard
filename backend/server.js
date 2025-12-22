import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import dotenv from 'dotenv';

// Імпорт УСІХ контролерів
import * as AuthController from "./controllers/authController.js";
import * as UnitController from "./controllers/unitController.js";
import * as TestController from "./controllers/testController.js";
import * as IoTController from "./controllers/iotController.js";
import * as ReportController from "./controllers/reportController.js";
import * as AdminController from "./controllers/adminController.js";
import * as UserController from "./controllers/userController.js";

dotenv.config();

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Підключення до БД
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ DB connection error:', err));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- МАРШРУТИ ---

app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);
app.get('/api/auth/me', AuthController.getMe);

// Units
app.post('/api/units', UnitController.createUnit);
app.get('/api/units', UnitController.getUnits);
app.delete('/api/units/:id', UnitController.deleteUnit);
app.get('/api/units/:id/members', UnitController.getUnitMembers);

// Tests
app.post('/api/tests', TestController.saveTestResult);
app.get('/api/tests/history', TestController.getHistory);
app.get('/api/tests/stats/:unitId', TestController.getUnitStats);
app.delete('/api/tests/:id', TestController.deleteTest);

// IoT
app.post('/api/iot/data', IoTController.saveData);
app.get('/api/iot/latest/:userId', IoTController.getLatest);

// Reports
app.post('/api/reports/generate', ReportController.generateReport);
app.get('/api/reports', ReportController.getReports);
app.delete('/api/reports/:id', ReportController.deleteReport);

// Admin
app.post('/api/admin/backup', AdminController.createBackup);
app.get('/api/admin/export', AdminController.exportData);

// Users Management (Admin)
app.get('/api/users', UserController.getAllUsers);
app.get('/api/users/:id', UserController.getUserById);
app.patch('/api/users/:id', UserController.updateUser);
app.delete('/api/users/:id', UserController.deleteUser);

// Запуск
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs at http://localhost:${PORT}/api-docs`);
});