const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

// Secret pour le refresh token (différent de l'access token pour plus de sécurité)
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET_EMMA123";

module.exports = {
    checkJwt: (req, res, next) => {
        console.log('\n🔒 [JWT MIDDLEWARE] Vérification du token...');

        // Get the JWT from the request header.
        const token = req.headers['authorization'];

        if (!token) {
            console.log('❌ [JWT MIDDLEWARE] Pas de token dans les headers');
            return res.status(401).json({ message: 'Missing or invalid token' });
        }

        let jwtPayload;

        // Validate the token and retrieve its data.
        try {
            // Verify the payload fields
            let jwtBearer = token.split(' ')[1];
            console.log("✅ [JWT MIDDLEWARE] Token reçu: " + jwtBearer.substring(0, 50) + "...");

            jwtPayload = jwt.verify(jwtBearer, ACCESS_TOKEN_SECRET, {
                complete: true,
                algorithms: ['HS256'],
                clockTolerance: 0,
                ignoreExpiration: false,
                ignoreNotBefore: false
            });

            // Add the payload to the request so controllers may access it.
            // IMPORTANT: Mettre le payload dans req.user pour compatibilité avec les contrôleurs
            req.user = jwtPayload.payload;
            req.token = jwtPayload; // Garder aussi req.token pour compatibilité

            console.log('✅ [JWT MIDDLEWARE] Token valide pour utilisateur:', req.user.id, '-', req.user.name);
        } catch (error) {
            console.log('❌ [JWT MIDDLEWARE] Token invalide:', error.message);
            res.status(401)
                .type('json')
                .send(JSON.stringify({ message: 'Missing or invalid token' }));
            return;
        }

        // Pass programmatic flow to the next middleware/controller.
        console.log('✅ [JWT MIDDLEWARE] Accès autorisé\n');
        next();
    },

    /**
     * Générer un Access Token JWT (courte durée - 30 minutes)
     * @param {object} user - Objet utilisateur { id, name, email }
     * @returns {string} - Token JWT
     */
    generateAccessToken: (user) => {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        return jwt.sign(
            payload,
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1800s' } // 30 minutes
        );
    },

    /**
     * Générer un Refresh Token JWT (longue durée - 7 jours)
     * @param {object} user - Objet utilisateur { id }
     * @returns {string} - Refresh Token JWT
     */
    generateRefreshToken: (user) => {
        const payload = {
            id: user.id
        };

        return jwt.sign(
            payload,
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } // 7 jours
        );
    },

    /**
     * Vérifier un Refresh Token
     * @param {string} token - Refresh Token à vérifier
     * @returns {object} - Payload décodé ou null si invalide
     */
    verifyRefreshToken: (token) => {
        try {
            return jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (error) {
            return null;
        }
    },

    REFRESH_TOKEN_SECRET
}
