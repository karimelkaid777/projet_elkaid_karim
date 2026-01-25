# 🌱 Seeds - Données de test

Ce dossier contient les scripts pour peupler la base de données avec des données de test.

## 📦 Données disponibles

**Pollutions** : 12 pollutions de test variées
- 3 × Chimique (déversements, pesticides)
- 2 × Air (émissions toxiques, particules fines)
- 2 × Eau (hydrocarbures, substances toxiques)
- 3 × Plastique (plages, festivals)
- 2 × Dépôt sauvage (déchets toxiques, amiante)
- 2 × Autre (pollution sonore, lumineuse)

Couvre différentes villes de France avec coordonnées GPS réelles.

## 🚀 Utilisation

### 1. Ajouter les données (si la base est vide)

```bash
cd api
npm run seed
```

**Résultat** :
- ✅ Ajoute 12 pollutions si la base est vide
- ⚠️  Ne fait rien si des données existent déjà

### 2. Réinitialiser la base (supprimer toutes les pollutions)

```bash
npm run seed:reset
```

**Résultat** :
- 🗑️ Supprime toutes les pollutions existantes
- ℹ️ Ne touche PAS aux utilisateurs

### 3. Réinitialiser ET peupler (tout en un)

```bash
npm run seed:fresh
```

**Résultat** :
- 🔄 Supprime toutes les pollutions
- 🌱 Recrée les 12 pollutions de test
- 💯 Base propre et prête à l'emploi

## 💡 Cas d'usage

### Développement quotidien
```bash
npm run seed  # Une seule fois au début
```

### Après avoir cassé les données
```bash
npm run seed:fresh  # Reset complet
```

### Tests manuels
```bash
npm run seed:reset  # Vider
# ... tests manuels ...
npm run seed        # Repeupler
```

## 📝 Notes

- Les scripts sont **idempotents** : safe à exécuter plusieurs fois
- Les utilisateurs ne sont **jamais affectés**
- Les IDs sont **auto-générés** par la base
- Les coordonnées GPS sont **réelles** (testées)

## 🎯 Prochaines étapes

Pour ajouter d'autres seeds :
1. Créer `utilisateurs.seed.js`
2. Créer `categories.seed.js`
3. Ajouter les scripts dans `package.json`
