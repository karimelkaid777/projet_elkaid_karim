const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../middlewares/jwt.middleware');
const { comparePassword } = require('../middlewares/password.helper');
const db = require("../models");
const Utilisateurs = db.utilisateurs;

/**
 * POST /api/auth/login
 * Login utilisateur et génération des tokens (access + refresh)
 */
exports.login = async (req, res) => {
  try {
    console.log('\n🔐 [AUTH LOGIN] Tentative de connexion...');
    const { login, password } = req.body;
    console.log('📝 [AUTH LOGIN] Login:', login);

    // Trouver l'utilisateur par login
    const data = await Utilisateurs.findOne({ where: { login } });

    if (!data) {
      console.log('❌ [AUTH LOGIN] Utilisateur non trouvé');
      return res.status(404).send({
        message: `Utilisateur non trouvé avec le login=${login}`
      });
    }

    console.log('✅ [AUTH LOGIN] Utilisateur trouvé:', data.nom, data.prenom);

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await comparePassword(password, data.pass);

    if (!isPasswordValid) {
      console.log('❌ [AUTH LOGIN] Mot de passe incorrect');
      return res.status(401).send({
        message: 'Mot de passe incorrect'
      });
    }

    console.log('✅ [AUTH LOGIN] Mot de passe correct');

    // Générer les tokens
    const user = {
      id: data.id,
      name: data.nom,
      email: data.email
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken({ id: data.id });

    console.log('🎫 [AUTH LOGIN] Access token généré (30 min):', accessToken.substring(0, 30) + '...');
    console.log('🎫 [AUTH LOGIN] Refresh token généré (7 jours):', refreshToken.substring(0, 30) + '...');

    // Renvoyer les tokens dans le body ET le accessToken dans le header
    // Header pour compatibilité avec le code existant
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    const response = {
      accessToken,    // Access token dans le body pour le store
      refreshToken,   // Refresh token dans le body pour le localStorage
      user: {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        login: data.login,
        email: data.email
      }
    };

    console.log('✅ [AUTH LOGIN] Login réussi pour:', data.nom, data.prenom);
    console.log('📤 [AUTH LOGIN] Envoi des tokens au client\n');

    res.send(response);
  } catch (err) {
    console.log('❌ [AUTH LOGIN] Erreur:', err.message);
    res.status(500).send({
      message: err.message || "Erreur lors de la connexion"
    });
  }
};

/**
 * POST /api/auth/refresh
 * Rafraîchir l'access token avec un refresh token valide
 */
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).send({
        message: 'Refresh token manquant'
      });
    }

    // Vérifier le refresh token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return res.status(403).send({
        message: 'Refresh token invalide ou expiré'
      });
    }

    // Récupérer l'utilisateur depuis la base
    const data = await Utilisateurs.findOne({ where: { id: payload.id } });

    if (!data) {
      return res.status(404).send({
        message: 'Utilisateur non trouvé'
      });
    }

    // Générer un nouvel access token
    const user = {
      id: data.id,
      name: data.nom,
      email: data.email
    };

    const newAccessToken = generateAccessToken(user);

    // Renvoyer le nouvel access token
    res.send({
      accessToken: newAccessToken
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors du rafraîchissement du token"
    });
  }
};

/**
 * POST /api/auth/logout
 * Logout utilisateur (optionnel - le client supprime les tokens)
 */
exports.logout = (req, res) => {
  // Dans un système JWT stateless, le logout est géré côté client
  // On peut éventuellement implémenter une blacklist de tokens ici
  res.send({
    message: 'Déconnexion réussie'
  });
};
