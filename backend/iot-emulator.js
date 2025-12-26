const axios = require('axios');

// --- НАЛАШТУВАННЯ ---
const CONFIG = {
    serverUrl: 'http://localhost:3000/api/iot/data',
    userId: '694edf17f4fb3c238f27865d', // ID бійця
    interval: 1000, // Частота відправки
    pulseThreshold: 150 // Поріг нормального пульсу для фільтрації
};

function processSensorData(rawPulse) {
    if (rawPulse > CONFIG.pulseThreshold) {
        console.log(`[IoT] Filtered abnormal pulse: ${rawPulse} -> ${CONFIG.pulseThreshold}`);
        return CONFIG.pulseThreshold;
    }
    return rawPulse;
}

async function sendTelemetry() {
    const rawPulse = Math.floor(Math.random() * (190 - 60) + 60); 
    const stressLevel = Math.floor(Math.random() * 10) + 1;

    const filteredPulse = processSensorData(rawPulse);

    const payload = {
        user_id: CONFIG.userId,
        pulse_rate: filteredPulse,
        stress_level: stressLevel,
        timestamp: new Date()
    };

    try {
        const response = await axios.post(CONFIG.serverUrl, payload);
        console.log(`[IoT] Data sent! Status: ${response.status}. Pulse: ${filteredPulse}`);
    } catch (error) {
        console.error(`[IoT] Error sending data: ${error.message}`);
    }
}

console.log("CogniGuard IoT Emulator started...");
setInterval(sendTelemetry, CONFIG.interval);