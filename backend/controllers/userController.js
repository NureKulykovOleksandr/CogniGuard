import User from "../models/User.js";

// Отримати список всіх користувачів
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password_hash");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Помилка отримання списку", error });
    }
};

// Видалити користувача (Звільнення)
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Користувача видалено з системи" });
    } catch (error) {
        res.status(500).json({ message: "Помилка видалення", error });
    }
};

// Отримати одного користувача за ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password_hash");
        if (!user) return res.status(404).json({ message: "Користувача не знайдено" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера", error });
    }
};

// Оновити дані користувача
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Помилка оновлення", error });
    }
};