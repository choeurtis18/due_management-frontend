import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGetCategory, useUpdateCategory } from "../../hooks/useCategories";

export default function UpdateCategorie() {
  const { id } = useParams(); // Récupère l'ID de la catégorie depuis les paramètres d'URL
  const categoryId = parseInt(id, 10); // Convertit l'ID en nombre
  const navigate = useNavigate(); // Utilisé pour la redirection après mise à jour

  const { category, loading: loadingCategory, error: errorCategory } = useGetCategory(categoryId);
  const { updateCategory } = useUpdateCategory();

  const [categoryUpdate, setCategoryUpdate] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState(""); // Message d'erreur
  const [successMessage, setSuccessMessage] = useState(""); // Message de succès

  useEffect(() => {
    if (category) {
      setCategoryUpdate({
        name: category.name,
        description: category.description,
      });
    }
  }, [category]);

  // Affichage de l'état de chargement ou des erreurs
  if (loadingCategory) {
    return <div className="text-center">Chargement...</div>;
  }

  if (errorCategory) {
    return <div className="text-center text-red-600">Erreur lors du chargement de la catégorie.</div>;
  }

  // Gestion des changements dans les champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryUpdate({ ...categoryUpdate, [name]: value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryUpdate.name.trim() || !categoryUpdate.description.trim()) {
      setError("Le nom et la description sont obligatoires.");
      return;
    }

    try {
      await updateCategory(categoryId, categoryUpdate);
      setError("");
      setSuccessMessage("La catégorie a été mise à jour avec succès.");
      setTimeout(() => {
        navigate(`/categories/${categoryId}`); // Redirection après un court délai
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie :", error);
      setError("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <div className='lg:pl-72'>
    <div className="pt-8 pb-16 bg-white antialiased px-4">
      <h1 className="text-base font-semibold text-gray-900">
        Mettre à jour la catégorie : {categoryUpdate.name}
      </h1>

      {/* Messages de feedback */}
      {error && <div className="mt-2 text-red-600">{error}</div>}
      {successMessage && <div className="mt-2 text-green-600">{successMessage}</div>}

      {/* Formulaire de mise à jour */}
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            Nom
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              type="text"
              value={categoryUpdate.name}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
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
              value={categoryUpdate.description}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Mettre à jour la catégorie
        </button>
      </form>
    </div>
    </div>
  );
}
