const { v4: uuidv4 } = require ("uuid");
const { generateAccessToken } = require('../middlewares/jwt.middleware');
const { hashPassword, comparePassword } = require('../middlewares/password.helper');

const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

// GET all utilisateurs
exports.getAll = (req, res) => {
    Utilisateurs.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erreur lors de la récupération des utilisateurs"
            });
        });
};

// CREATE new utilisateur
exports.create = async (req, res) => {
    try {
        // Les données sont déjà validées par le middleware Zod

        // Hasher le mot de passe
        const hashedPassword = await hashPassword(req.body.pass);

        // Create utilisateur object
        const utilisateur = {
            id: uuidv4(),
            nom: req.body.nom,
            prenom: req.body.prenom,
            login: req.body.login,
            email: req.body.email,
            pass: hashedPassword // Stocker le hash au lieu du mot de passe en clair
        };

        // Save to database
        const data = await Utilisateurs.create(utilisateur);
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de l'utilisateur"
        });
    }
};

// Find a single Utilisateur with an login
exports.login = async (req, res) => {
  try {
    // Les données sont déjà validées par le middleware Zod
    const utilisateur = {
      login: req.body.login,
      password: req.body.password
    };

    const data = await Utilisateurs.findOne({ where: { login: utilisateur.login } });

    if (!data) {
      return res.status(404).send({
        message: `Utilisateur non trouvé avec le login=${utilisateur.login}`
      });
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await comparePassword(utilisateur.password, data.pass);

    if (!isPasswordValid) {
      return res.status(401).send({
        message: 'Mot de passe incorrect'
      });
    }

    // Générer le JWT avec payload complet (id, name, email)
    const user = {
      id: data.id,
      name: data.nom,
      email: data.email
    };
    const token = generateAccessToken(user);

    // Définir le header Authorization avec le token
    res.setHeader('Authorization', `Bearer ${token}`);

    // Renvoyer uniquement les données utilisateur (sans le token dans le body)
    const response = {
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      login: data.login,
      email: data.email
    };

    res.send(response);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la connexion"
    });
  }
};
