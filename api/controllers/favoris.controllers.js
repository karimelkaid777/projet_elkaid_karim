const db = require('../models');
const Favoris = db.favoris;
const Pollution = db.pollution;

/**
 * GET /api/favoris
 * Récupérer tous les favoris de l'utilisateur connecté
 */
exports.getMesFavoris = async (req, res) => {
    try {
        console.log('\n⭐ [FAVORIS GET] Récupération des favoris...');
        const utilisateurId = req.user.id; // Extrait du JWT par le middleware
        console.log('👤 [FAVORIS GET] Utilisateur:', req.user.name, '(ID:', utilisateurId + ')');

        // Récupérer les favoris avec les détails des pollutions
        const favoris = await Favoris.findAll({
            where: { utilisateur_id: utilisateurId },
            include: [{
                model: Pollution,
                as: 'pollution',
                attributes: ['id', 'titre', 'type_pollution', 'description', 'date_observation', 'lieu', 'latitude', 'longitude', 'photo_url']
            }]
        });

        console.log(`✅ [FAVORIS GET] ${favoris.length} favori(s) trouvé(s)`);

        // Formater la réponse pour renvoyer les pollutions en camelCase
        const pollutions = favoris.map(fav => {
            const p = fav.pollution;
            return {
                id: p.id,
                title: p.titre,
                type: p.type_pollution,
                description: p.description,
                dateObservation: p.date_observation,
                location: p.lieu,
                latitude: parseFloat(p.latitude),
                longitude: parseFloat(p.longitude),
                photoUrl: p.photo_url
            };
        });

        console.log('📤 [FAVORIS GET] Envoi des favoris au client\n');
        res.json(pollutions);
    } catch (error) {
        console.error('❌ [FAVORIS GET] Erreur:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des favoris'
        });
    }
};

/**
 * POST /api/favoris
 * Ajouter une pollution aux favoris
 */
exports.addFavori = async (req, res) => {
    try {
        console.log('\n➕ [FAVORIS ADD] Ajout d\'un favori...');
        const utilisateurId = req.user.id;
        const { pollutionId } = req.body;
        console.log('👤 [FAVORIS ADD] Utilisateur:', req.user.name, '(ID:', utilisateurId + ')');
        console.log('🏭 [FAVORIS ADD] Pollution ID:', pollutionId);

        // Vérifier si la pollution existe
        const pollution = await Pollution.findByPk(pollutionId);
        if (!pollution) {
            console.log('❌ [FAVORIS ADD] Pollution non trouvée');
            return res.status(404).json({
                message: 'Pollution non trouvée'
            });
        }

        console.log('✅ [FAVORIS ADD] Pollution trouvée:', pollution.titre);

        // Vérifier si déjà en favoris
        const existing = await Favoris.findOne({
            where: {
                utilisateur_id: utilisateurId,
                pollution_id: pollutionId
            }
        });

        if (existing) {
            console.log('⚠️ [FAVORIS ADD] Déjà dans les favoris');
            return res.status(409).json({
                message: 'Cette pollution est déjà dans vos favoris'
            });
        }

        // Créer le favori
        await Favoris.create({
            utilisateur_id: utilisateurId,
            pollution_id: pollutionId
        });

        console.log('✅ [FAVORIS ADD] Favori ajouté avec succès!');

        // Renvoyer la pollution formatée
        const formattedPollution = {
            id: pollution.id,
            title: pollution.titre,
            type: pollution.type_pollution,
            description: pollution.description,
            dateObservation: pollution.date_observation,
            location: pollution.lieu,
            latitude: parseFloat(pollution.latitude),
            longitude: parseFloat(pollution.longitude),
            photoUrl: pollution.photo_url
        };

        console.log('📤 [FAVORIS ADD] Envoi de la pollution au client\n');
        res.status(201).json(formattedPollution);
    } catch (error) {
        console.error('❌ [FAVORIS ADD] Erreur:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'ajout du favori'
        });
    }
};

/**
 * DELETE /api/favoris/:pollutionId
 * Retirer une pollution des favoris
 */
exports.removeFavori = async (req, res) => {
    try {
        const utilisateurId = req.user.id;
        const pollutionId = parseInt(req.params.pollutionId);

        // Supprimer le favori
        const deleted = await Favoris.destroy({
            where: {
                utilisateur_id: utilisateurId,
                pollution_id: pollutionId
            }
        });

        if (deleted === 0) {
            return res.status(404).json({
                message: 'Favori non trouvé'
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Erreur removeFavori:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression du favori'
        });
    }
};

/**
 * DELETE /api/favoris
 * Supprimer tous les favoris de l'utilisateur
 */
exports.clearFavoris = async (req, res) => {
    try {
        const utilisateurId = req.user.id;

        await Favoris.destroy({
            where: { utilisateur_id: utilisateurId }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Erreur clearFavoris:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression des favoris'
        });
    }
};
