import { useState } from 'react';

import { useAddCategory } from "../../hooks/useCategories";

export default function AddCategorie() {
    const { addCategory } = useAddCategory();
    const [category, setCategory] = useState({ name: "", description: "" }); // Les informations de la catégorie
    const [error, setError] = useState(null); // Message d'erreur

    // Gère les changements dans les champs de saisie
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    // Envoie les informations de la catégorie au serveur
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addCategory(category);
            window.location.href = "/categories";
        } catch (error) {
            console.error("Error adding category:", error);
            setError("Erreur pendant l'ajout de la tontine. Veuillez réessayer.");
        }
    };

    return (
        <div className='lg:pl-72'>
        <div className="pt-8 pb-16 bg-white antialiased px-4">
            <h1 className="text-lg font-semibold text-gray-900">Ajouter une tontine</h1>

            {/* Affiche les erreurs */}
            {error && (
                <div className="mt-4 text-sm text-red-600" role="alert">
                    {error}
                </div>
            )}

            {/* Formulaire d'ajout de tontine */}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mt-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                        Nom de la tontine
                    </label>
                    <div className="mt-2">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Mariage"
                            value={category.name}
                            onChange={handleInputChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                        Description
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Tontine spéciale pour le mariage de Jean et Marie"
                            value={category.description}
                            onChange={handleInputChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                </div>

                {/* Bouton d'ajout de tontine */}
                <button
                    type="submit"
                    className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Ajouter la tontine
                </button>
            </form>
        </div>
        </div>
    );
}
