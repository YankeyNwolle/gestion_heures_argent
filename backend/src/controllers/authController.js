// controllers/authController.js
const pool = require("../config/database");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // insérer le nouvel utilisateur dans la base de données
    const newUser = await pool.query(
      "INSERT INTO users (email,password_hash,first_name,last_name) VALUES ($1, $2, $3,$4,$5) RETURNING id, email, password_hash,first_name,last_name",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};