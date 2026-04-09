import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

//  INSCRIPTION
export const register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, first_name, last_name, grade, status } = req.body;

    await client.query('BEGIN');

    // Vérifier si l'utilisateur existe déjà
    const userExists = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer le compte utilisateur (rôle enseignant par défaut)
    const newUser = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, 'enseignant')
       RETURNING id, email, first_name, last_name, role`,
      [email, hashedPassword, first_name, last_name]
    );
    const userData = newUser.rows[0];

    // Créer le profil enseignant avec grade et status
    await client.query(
      `INSERT INTO teachers (user_id, grade, status)
       VALUES ($1, $2, $3)`,
      [userData.id, grade ?? 'assistant', status ?? 'permanent']
    );

    await client.query('COMMIT');

    // Générer un JWT pour auto-connexion après inscription
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: { ...userData, grade: grade ?? 'assistant', status: status ?? 'permanent' },
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", detail: error.message });
  } finally {
    client.release();
  }
};

//  CONNEXION
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Générer un JWT
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        first_name: user.rows[0].first_name,
        last_name: user.rows[0].last_name,
        role: user.rows[0].role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};