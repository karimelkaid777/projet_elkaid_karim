const { z } = require('zod');

// Schéma pour ajouter un favori
const addFavoriSchema = z.object({
    pollutionId: z.number({
        required_error: "L'ID de la pollution est requis",
        invalid_type_error: "L'ID doit être un nombre"
    }).int("L'ID doit être un entier").positive("L'ID doit être positif")
});

// Schéma pour l'ID dans les paramètres d'URL (suppression)
const favoriIdParamSchema = z.object({
    pollutionId: z.string()
        .regex(/^\d+$/, "L'ID doit être un nombre entier")
        .transform(Number)
});

module.exports = {
    addFavoriSchema,
    favoriIdParamSchema
};
