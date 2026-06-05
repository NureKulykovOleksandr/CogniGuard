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
    try {
        const { login, password } = req.body;
        const user = await User.findOne({ login });
        
        if (!user || user.password_hash !== password) {
            return res.status(401).json({ message: "Невірний логін або пароль" });
        }
        
        res.json({ 
            token: user._id.toString(), 
            user: { 
                id: user._id, 
                login: user.login, 
                full_name: user.full_name, 
                role: user.role,
                unit_id: user.unit_id
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера", error });
    }
};

export const getMe = async (req, res) => {
    res.json({ name: "Test User", role: "soldier" });
};