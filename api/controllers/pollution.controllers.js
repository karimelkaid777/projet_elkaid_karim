const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {
    const { type, title } = req.query;

    const whereClause = {};

    // Conversion des noms frontend vers BDD
    if (type) {
        whereClause.type_pollution = type;
    }

    if (title) {
        whereClause.titre = {
            [Op.iLike]: `%${title}%`
        };
    }

    Pollution.findAll({ where: whereClause })
        .then(data => {
            // Conversion des données BDD vers format frontend
            const formattedData = data.map(pollution => ({
                id: pollution.id,
                title: pollution.titre,
                type: pollution.type_pollution,
                description: pollution.description,
                dateObservation: pollution.date_observation,
                location: pollution.lieu,
                latitude: pollution.latitude,
                longitude: pollution.longitude,
                photoUrl: pollution.photo_url
            }));
            res.send(formattedData);
        })
        .catch(err => {
            res.status(400).send({
                message: err.message
            });
        });
};

// GET pollution by ID
exports.getById = (req, res) => {
    const id = req.params.id;

    Pollution.findByPk(id)
        .then(data => {
            if (data) {
                // Conversion vers format frontend
                const formattedData = {
                    id: data.id,
                    title: data.titre,
                    type: data.type_pollution,
                    description: data.description,
                    dateObservation: data.date_observation,
                    location: data.lieu,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    photoUrl: data.photo_url
                };
                res.send(formattedData);
            } else {
                res.status(404).send({
                    message: `Pollution non trouvée avec l'id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Erreur lors de la récupération de la pollution avec l'id=${id}`
            });
        });
};

// CREATE new pollution
exports.create = (req, res) => {
    // Les données sont déjà validées par le middleware Zod
    // Conversion frontend vers BDD
    const pollution = {
        titre: req.body.title,
        type_pollution: req.body.type,
        description: req.body.description,
        date_observation: req.body.dateObservation,
        lieu: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        photo_url: req.body.photoUrl
    };

    // Save to database
    Pollution.create(pollution)
        .then(data => {
            // Conversion BDD vers frontend
            const formattedData = {
                id: data.id,
                title: data.titre,
                type: data.type_pollution,
                description: data.description,
                dateObservation: data.date_observation,
                location: data.lieu,
                latitude: data.latitude,
                longitude: data.longitude,
                photoUrl: data.photo_url
            };
            res.status(201).send(formattedData);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erreur lors de la création de la pollution"
            });
        });
};

// UPDATE pollution by ID
exports.update = (req, res) => {
    const id = req.params.id;

    // Conversion frontend vers BDD
    const updateData = {};
    if (req.body.title !== undefined) updateData.titre = req.body.title;
    if (req.body.type !== undefined) updateData.type_pollution = req.body.type;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.dateObservation !== undefined) updateData.date_observation = req.body.dateObservation;
    if (req.body.location !== undefined) updateData.lieu = req.body.location;
    if (req.body.latitude !== undefined) updateData.latitude = req.body.latitude;
    if (req.body.longitude !== undefined) updateData.longitude = req.body.longitude;
    if (req.body.photoUrl !== undefined) updateData.photo_url = req.body.photoUrl;

    Pollution.update(updateData, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                // Récupérer l'objet mis à jour pour le renvoyer
                Pollution.findByPk(id)
                    .then(data => {
                        // Conversion BDD vers frontend
                        const formattedData = {
                            id: data.id,
                            title: data.titre,
                            type: data.type_pollution,
                            description: data.description,
                            dateObservation: data.date_observation,
                            location: data.lieu,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            photoUrl: data.photo_url
                        };
                        res.send(formattedData);
                    });
            } else {
                res.status(404).send({
                    message: `Impossible de mettre à jour la pollution avec l'id=${id}. Pollution non trouvée.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Erreur lors de la mise à jour de la pollution avec l'id=${id}`
            });
        });
};

// DELETE pollution by ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Pollution.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(404).send({
                    message: `Impossible de supprimer la pollution avec l'id=${id}. Pollution non trouvée.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Erreur lors de la suppression de la pollution avec l'id=${id}`
            });
        });
};
