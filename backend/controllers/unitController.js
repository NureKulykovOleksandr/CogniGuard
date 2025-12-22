import Unit from "../models/Unit.js";
import User from "../models/User.js";

export const createUnit = async (req, res) => {
    try {
        const newUnit = new Unit(req.body);
        await newUnit.save();
        res.status(201).json(newUnit);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getUnits = async (req, res) => {
    try {
        const units = await Unit.find();
        res.json(units);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUnit = await Unit.findByIdAndDelete(id);

        if (!deletedUnit) {
            return res.status(404).json({ message: "Підрозділ не знайдено" });
        }

        res.json({ message: "Підрозділ успішно розформовано (видалено)" });
    } catch (error) {
        res.status(500).json({ message: "Помилка видалення", error });
    }
};

export const getUnitMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const members = await User.find({ unit_id: id }).select("-password_hash");
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Помилка пошуку бійців", error });
    }
};