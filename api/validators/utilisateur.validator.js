const { z } = require('zod');

// Schéma pour la création d'un utilisateur
const createUtilisateurSchema = z.object({
    nom: z.string()
        .trim()
        .min(1, "Le nom est obligatoire")
        .max(100, "Le nom ne peut pas dépasser 100 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"),

    prenom: z.string()
        .trim()
        .min(1, "Le prénom est obligatoire")
        .max(100, "Le prénom ne peut pas dépasser 100 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets"),

    login: z.string()
        .trim()
        .min(3, "Le login doit contenir au moins 3 caractères")
        .max(20, "Le login ne peut pas dépasser 20 caractères")
        .regex(/^[A-Za-z0-9._-]+$/, "Le login ne peut contenir que des lettres, chiffres, points, underscores et tirets"),

    email: z.string()
        .trim()
        .email("Format d'email invalide")
        .toLowerCase()
        .max(255, "L'email ne peut pas dépasser 255 caractères"),

    pass: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
        )
}).strict();

// Schéma pour le login
const loginSchema = z.object({
    login: z.string()
        .trim()
        .min(1, "Le login est obligatoire")
        .max(20, "Le login ne peut pas dépasser 20 caractères")
        .regex(/^[A-Za-z0-9._-]+$/, "Le login ne peut contenir que des lettres, chiffres, points, underscores et tirets"),

    password: z.string()
        .min(1, "Le mot de passe est obligatoire")
        .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
}).strict();

// Schéma pour l'ID dans les paramètres d'URL
const utilisateurIdSchema = z.object({
    id: z.string()
        .uuid("L'ID doit être un UUID valide")
});

module.exports = {
    createUtilisateurSchema,
    loginSchema,
    utilisateurIdSchema
};
