# LogiSmart

LogiSmart est une application web progressive de gestion logistique et douanière conçue pour simplifier les processus complexes d'expédition internationale en Afrique. L'application offre une solution complète incluant le calcul de tarifs, le suivi de colis, la recherche de codes SH, l'assistance douanière par IA, et le support logistique en temps réel.

## 🌟 Fonctionnalités Principales

### 📦 Gestion des Expéditions
- **Création d'envois** : Interface intuitive pour créer de nouveaux envois avec toutes les informations nécessaires
- **Suivi en temps réel** : Surveillance continue des colis avec mises à jour automatiques
- **Calcul de tarifs** : Estimation automatique des coûts selon le mode de transport (aérien, maritime, routier)
- **Gestion des documents** : Upload et stockage sécurisé des documents douaniers

### 🤖 Assistant IA Douanier
- **Chatbot intelligent** : Assistance 24/7 pour les questions douanières
- **Recherche de codes SH** : Identification automatique des codes du système harmonisé
- **Suggestions d'optimisation** : Recommandations pour réduire les coûts et délais

### 🔍 Suivi et Alertes
- **Notifications en temps réel** : Alertes automatiques sur les changements de statut
- **Alertes réglementaires** : Information sur les nouvelles régulations douanières
- **Historique complet** : Traçabilité détaillée de tous les événements

### 🌍 Support Multilingue
- Interface disponible en **Français** et **Anglais**
- Adaptation aux marchés africains
- Terminologie logistique locale

## 🎨 Design et Interface

### Palette de Couleurs
- **Violet principal** (`#8B5CF6`) : Actions primaires et navigation
- **Bleu secondaire** (`#3B82F6`) : Éléments informatifs et liens
- **Blanc/Gris** : Arrière-plan et texte pour une lisibilité optimale

### Navigation Mobile
- **Navigation inférieure fixe** avec 4 sections principales :
  - 🏠 **Accueil** : Tableau de bord principal
  - ➕ **Créer** : Nouvelle expédition
  - 🎧 **Support** : Assistance et chatbot
  - 👤 **Compte** : Profil et paramètres

## 🛠️ Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants
- **TanStack Query** pour la gestion d'état
- **Wouter** pour le routage
- **Vite** comme bundler

### Backend
- **Express.js** avec TypeScript
- **PostgreSQL** avec Drizzle ORM
- **Neon Database** (serverless)
- **Replit Auth** (OpenID Connect)

### Stockage et Données
- **Base de données PostgreSQL** pour les données principales
- **Google Cloud Storage** pour les documents
- **Sessions persistantes** avec stockage en base

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+
- Accès à une base de données PostgreSQL
- Compte Replit pour l'authentification

### Variables d'Environnement
```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret
REPLIT_DOMAINS=your-domain.replit.app
```

### Installation
```bash
# Installation des dépendances
npm install

# Configuration de la base de données
npm run db:push

# Lancement en développement
npm run dev
```

L'application sera accessible sur `http://localhost:5005`

## 📱 Guide d'Utilisation

### 1. Connexion
- Utilisez le système d'authentification Replit
- Accès sécurisé avec gestion de sessions

### 2. Création d'un Envoi
1. Cliquez sur l'onglet "Créer" en bas
2. Remplissez les informations d'expéditeur et destinataire
3. Ajoutez les détails du colis (poids, dimensions, valeur)
4. Sélectionnez le mode de transport
5. Confirmez pour générer un numéro de suivi

### 3. Suivi des Colis
- Visualisez tous vos envois sur le tableau de bord
- Consultez l'état en temps réel
- Recevez des notifications automatiques

### 4. Assistance IA
- Accédez au chatbot via l'onglet "Support"
- Posez vos questions sur les procédures douanières
- Obtenez des suggestions de codes SH

## 🔒 Sécurité et Conformité

- **Authentification sécurisée** avec OpenID Connect
- **Chiffrement des données** en transit et au repos
- **Gestion des sessions** avec expiration automatique
- **Contrôle d'accès** basé sur les rôles utilisateur

## 📊 Base de Données

### Tables Principales
- `users` : Informations utilisateurs
- `shipments` : Données des expéditions
- `tracking_events` : Événements de suivi
- `documents` : Documents uploadés
- `hs_codes` : Codes du système harmonisé
- `regulatory_alerts` : Alertes réglementaires
- `chat_messages` : Historique des conversations

## 🌐 API

### Endpoints Principaux
```
GET /api/shipments - Liste des expéditions
POST /api/shipments - Créer une expédition
GET /api/shipments/:id/tracking - Suivi d'une expédition
POST /api/calculate-tariff - Calcul de tarif
POST /api/chat/messages - Messages du chatbot
GET /api/regulatory-alerts - Alertes réglementaires
```

## 🚀 Déploiement

L'application est optimisée pour le déploiement sur Replit avec :
- **Déploiement automatique** depuis le repository
- **Scaling automatique** selon la charge
- **SSL/TLS** intégré pour la sécurité
- **Domaine personnalisé** disponible

## 🔄 Développement

### Structure du Projet
```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages principales
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── lib/           # Utilitaires
├── server/                # Backend Express
│   ├── routes.ts          # Routes API
│   ├── storage.ts         # Couche de données
│   └── replitAuth.ts      # Authentification
├── shared/                # Types partagés
│   └── schema.ts          # Schéma de base de données
└── README.md
```

### Scripts Disponibles
```bash
npm run dev          # Lancement en développement
npm run build        # Build de production
npm run db:push      # Migration base de données
npm run type-check   # Vérification TypeScript
```

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créez une branche pour votre fonctionnalité
3. Implémentez vos changements
4. Testez thoroughly
5. Soumettez une pull request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Utilisez le chatbot intégré dans l'application
- Consultez la documentation API
- Contactez l'équipe de développement

---

**LogiSmart** - Simplifier la logistique africaine avec l'intelligence artificielle 🚀