import * as UserModel from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const {page=1,limit=20,role,search} = req.query;
    const result = await UserModel.getAllUsers({page:parseInt(page),limit:parseInt(limit),role,search});
    res.json(result);
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.getUserById(parseInt(req.params.id));
    if (!user) return res.status(404).json({message:"Utilisateur non trouvé"});
    res.json({user});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const createUser = async (req, res) => {
  try {
    const {email,password,first_name,last_name,role} = req.body;
    if (!email||!password||!first_name||!last_name) return res.status(400).json({message:"Champs requis manquants"});
    const existing = await UserModel.getUserByEmail(email);
    if (existing) return res.status(400).json({message:"Email déjà utilisé"});
    const user = await UserModel.createUser({email,password,first_name,last_name,role});
    res.status(201).json({message:"Utilisateur créé",user});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const updateUser = async (req, res) => {
  try {
    const user = await UserModel.updateUser(parseInt(req.params.id), req.body);
    if (!user) return res.status(404).json({message:"Utilisateur non trouvé"});
    res.json({message:"Utilisateur mis à jour",user});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.deleteUser(parseInt(req.params.id));
    if (!user) return res.status(404).json({message:"Utilisateur non trouvé"});
    res.json({message:"Utilisateur désactivé",user});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const changePassword = async (req, res) => {
  try {
    const {newPassword} = req.body;
    if (!newPassword||newPassword.length<8) return res.status(400).json({message:"Le mot de passe doit contenir au moins 8 caractères"});
    await UserModel.updatePassword(parseInt(req.params.id), newPassword);
    res.json({message:"Mot de passe modifié"});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
