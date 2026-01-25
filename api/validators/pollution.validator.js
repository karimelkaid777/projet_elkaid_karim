const { z } = require('zod');

// Types de pollution autorisés (correspond au frontend)
const typePollutionEnum = z.enum([
    'Plastique',
    'Chimique',
    'Dépôt sauvage',
    'Eau',
    'Air',
    'Autre'
]);

// Schéma pour la création d'une pollution
const createPollutionSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Le titre est obligatoire")
        .max(200, "Le titre ne peut pas dépasser 200 caractères"),

    type: typePollutionEnum,

    description: z.string()
        .trim()
        .min(1, "La description est obligatoire")
        .max(2000, "La description ne peut pas dépasser 2000 caractères"),

    dateObservation: z.string()
        .datetime({ message: "Format de date invalide. Utilisez ISO 8601" })
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide. Utilisez YYYY-MM-DD"))
        .or(z.date().transform(d => d.toISOString())),

    location: z.string()
        .trim()
        .min(1, "Le lieu est obligatoire")
        .max(200, "Le lieu ne peut pas dépasser 200 caractères"),

    latitude: z.number()
        .min(-90, "La latitude doit être entre -90 et 90")
        .max(90, "La latitude doit être entre -90 et 90")
        .or(z.string().regex(/^-?\d+\.?\d*$/).transform(Number)),

    longitude: z.number()
        .min(-180, "La longitude doit être entre -180 et 180")
        .max(180, "La longitude doit être entre -180 et 180")
        .or(z.string().regex(/^-?\d+\.?\d*$/).transform(Number)),

    photoUrl: z.string()
        .url("L'URL de la photo est invalide")
        .max(500, "L'URL ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal(''))
});

// Schéma pour la mise à jour (tous les champs optionnels)
const updatePollutionSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Le titre doit contenir au moins 1 caractère")
        .max(200, "Le titre ne peut pas dépasser 200 caractères")
        .optional(),

    type: typePollutionEnum
        .optional(),

    description: z.string()
        .trim()
        .max(2000, "La description ne peut pas dépasser 2000 caractères")
        .optional(),

    dateObservation: z.string()
        .datetime({ message: "Format de date invalide. Utilisez ISO 8601" })
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide. Utilisez YYYY-MM-DD"))
        .or(z.date().transform(d => d.toISOString()))
        .optional(),

    location: z.string()
        .trim()
        .max(200, "Le lieu ne peut pas dépasser 200 caractères")
        .optional(),

    latitude: z.number()
        .min(-90, "La latitude doit être entre -90 et 90")
        .max(90, "La latitude doit être entre -90 et 90")
        .or(z.string().regex(/^-?\d+\.?\d*$/).transform(Number))
        .optional(),

    longitude: z.number()
        .min(-180, "La longitude doit être entre -180 et 180")
        .max(180, "La longitude doit être entre -180 et 180")
        .or(z.string().regex(/^-?\d+\.?\d*$/).transform(Number))
        .optional(),

    photoUrl: z.string()
        .url("L'URL de la photo est invalide")
        .max(500, "L'URL ne peut pas dépasser 500 caractères")
        .optional()
        .or(z.literal(''))
}).strict();

// Schéma pour les paramètres de requête (GET)
const queryPollutionSchema = z.object({
    type: typePollutionEnum.optional(),
    title: z.string()
        .trim()
        .max(200)
        .optional()
});

// Schéma pour l'ID dans les paramètres d'URL
const pollutionIdSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, "L'ID doit être un nombre entier")
        .transform(Number)
});

module.exports = {
    createPollutionSchema,
    updatePollutionSchema,
    queryPollutionSchema,
    pollutionIdSchema
};
