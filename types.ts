// Enum pour le rôle des utilisateurs
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

// Interface pour User
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
}

// Interface pour Member
export interface Member {
    id: number;
    firstName: string;
    lastName: string;
    creation_date: Date; // Date de création du membre
    update_date: Date; // Date de mise à jour du membre
    dues?: Dues[]; // Liste des cotisations associées au membre
    categories?: Category[]; // Catégories auxquelles appartient le membre
}

// Interface pour Category
export interface Category {
    id: number;
    name: string; // Nom de la catégorie
    description: string; // Description de la catégorie
    creation_date: Date; // Date de création de la catégorie
    update_date: Date; // Date de mise à jour de la catégorie
    members?: Member[]; // Liste des membres associés à cette catégorie
    dues?: Dues[]; // Liste des cotisations associées à cette catégorie
}

// Interface pour Month
export interface Month {
    id: number;
    name: string; // Nom du mois (e.g., "Janvier", "Février")
    year: number; // Année associée au mois
    dues?: Dues[]; // Liste des cotisations associées à ce mois
}

// Interface pour Dues (Cotisations)
export interface Dues {
    id: number;
    amount: number; // Montant de la cotisation
    isLate: boolean; // Indique si la cotisation est en retard
    memberId: number; // ID du membre associé
    categoryId: number; // ID de la catégorie associée
    monthId: number; // ID du mois associé
    member?: Member; // Détails du membre associé
    category?: Category; // Détails de la catégorie associée
    month?: Month; // Détails du mois associé
}
