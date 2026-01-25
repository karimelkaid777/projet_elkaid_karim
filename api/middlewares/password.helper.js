const bcrypt = require('bcrypt');

// Nombre de rounds pour le salt (10 est un bon compromis sécurité/performance)
const SALT_ROUNDS = 10;

/**
 * Hasher un mot de passe avec bcrypt
 * @param {string} plainPassword - Le mot de passe en clair
 * @returns {Promise<string>} - Le mot de passe hashé
 */
const hashPassword = async (plainPassword) => {
    try {
        const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        return hash;
    } catch (error) {
        throw new Error('Erreur lors du hashing du mot de passe');
    }
};

/**
 * Comparer un mot de passe en clair avec un hash
 * @param {string} plainPassword - Le mot de passe en clair
 * @param {string} hashedPassword - Le hash stocké en base
 * @returns {Promise<boolean>} - true si le mot de passe correspond, false sinon
 */
const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Erreur lors de la vérification du mot de passe');
    }
};

module.exports = {
    hashPassword,
    comparePassword
};
