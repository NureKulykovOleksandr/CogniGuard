import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        // Розбираємо вхідні дані (Destructuring)
        const { full_name, login, password, rank, role } = req.body;

        //Створюємо юзера
        const newUser = new User({
            full_name,
            login,
            password_hash: password,
            rank,
            role,
            unit_id: req.body.unit_id 
        });

        await newUser.save();
        res.status(201).json({ message: "Користувача створено", user: newUser });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Помилка реєстрації", error });
    }
};

export const login = async (req, res) => {
    res.json({ token: "fake-jwt-token-123", user: req.body.login });
};

export const getMe = async (req, res) => {
    res.json({ name: "Test User", role: "soldier" });
};