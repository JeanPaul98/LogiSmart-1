# 📦 LogiSmart
LogiSmart est une application web progressive de gestion logistique et douanière conçue pour simplifier les processus complexes d'expédition internationale en Afrique. L'application offre une solution complète incluant le calcul de tarifs, le suivi de colis, la recherche de codes SH, l'assistance douanière par IA, et le support logistique en temps réel.


## 🌟 Fonctionnalités Principales
Plateforme moderne de **gestion logistique** permettant de :  
- Créer et suivre des **expéditions** (import/export).  
- Calculer des **tarifs et devis en ligne**.  
- Gérer des **documents** associés (facture, connaissement, assurance).  
- Suivre les **événements de tracking** en temps réel.  
- Rechercher et gérer des **codes HS (Harmonized System)**.  
- Envoyer et recevoir des **alertes réglementaires**.  
- Gérer les **utilisateurs** avec rôles (`user`, `admin`, `moderator`) et un système d’authentification extensible.  

---
### 🤖 Assistant IA Douanier
- **Chatbot intelligent** : Assistance 24/7 pour les questions douanières
- **Recherche de codes SH** : Identification automatique des codes du système harmonisé
- **Suggestions d'optimisation** : Recommandations pour réduire les coûts et délais

### 🌍 Support Multilingue
- Interface disponible en **Français** et **Anglais**
- Adaptation aux marchés africains
- Terminologie logistique locale

## 🚀 Stack Technique

### **Backend (API REST)**
- **Node.js + Express** : serveur web.
- **TypeORM** : ORM pour la base MySQL.
- **MySQL 8+** : base de données relationnelle.
- **Zod** : validation des DTOs (`@shared/schema`).
- **JWT (prévu)** : pour authentification & rôles.
- **Multer / S3 (prévu)** : pour gestion des fichiers/documents.

### **Frontend (SPA)**
- **React + Vite** (Typescript).
- **TailwindCSS** : UI rapide et responsive.
- **Wouter** : routing simple.
- **Lucide-react** : icônes.
- **React Hooks** : state et formulaires.

---

## 📂 Structure du projet

```
LogiSmart/
│
├── server/                  # Backend Node.js / Express
│   ├── app.ts               # App Express principale
│   ├── server.ts            # Entrée serveur
│   ├── middlewares/         # Middlewares Express (validate, auth, etc.)
│   ├── controllers/         # Contrôleurs API (UserController, ShipmentController, etc.)
│   ├── services/            # Services métier (UserService, DocumentService, etc.)
│   ├── entities/            # Entités TypeORM (User, Shipment, Document, etc.)
│   ├── Interface/           # Interfaces (IUser, IDocument, etc.)
│   ├── dbContext/           # DataSource TypeORM (`db.ts`)
│   └── routes/              # Routes Express regroupées
│
├── client/                  # Frontend React
│   ├── src/
│   │   ├── pages/           # Pages principales (Dashboard, SuiviColis, CalculTarif, etc.)
│   │   ├── components/      # Composants UI (Navbar, Sidebar, Layouts, etc.)
│   │   ├── App.tsx
│   │   └── main.tsx
│
├── shared/                  # Schémas Zod communs
│   └── schema.ts            # DTOs validés (User, Shipment, Document, etc.)
│
├── package.json             # Scripts et dépendances
└── tsconfig.json
```

---


## 🖥️ Frontend : pages principales

- **Dashboard** : vue d’ensemble (expéditions récentes, tracking en cours, carte, formulaire recherche tracking).  
- **Créer une expédition** : process en 4 étapes (Expéditeur/Destinataire → Détails → Colis → Services & Résumé).  
- **Suivi colis** : recherche par numéro de suivi + timeline + documents associés.  
- **Calculateur de tarifs** : formulaire + estimations + export PDF.  
- **Profil utilisateur** : paramètres compte + déconnexion.  

---

## 🔒 Sécurité & Auth (prévu)
- Hash des mots de passe avec **bcrypt**.  
- Authentification avec **JWT**.  
- Middleware `requireAuth` pour sécuriser les routes.  
- Gestion des rôles (`admin`, `user`, `moderator`).  

---

## ✅ Roadmap (prochaines étapes)

- [ ] Intégrer authentification complète (JWT + refresh).  
- [ ] Gérer upload documents (Multer / S3).  
- [ ] Notifications temps réel (WebSocket).  
- [ ] Tableau de bord analytique.  
- [ ] Déploiement Docker + CI/CD.  

---

## 👨‍💻 Auteurs
- **Développeur principal** : toi 😉  
- Projet conçu pour moderniser la gestion logistique en Afrique.  
