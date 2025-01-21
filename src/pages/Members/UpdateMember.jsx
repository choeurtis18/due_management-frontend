import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGetMember, useUpdateMember} from "../../hooks/useMembers";

export default function UpdateMember() {
  const { id } = useParams(); // Récupère l'ID de la catégorie depuis les paramètres d'URL
  const memberId = parseInt(id, 10); // Convertit l'ID en nombre
  const navigate = useNavigate(); // Utilisé pour la redirection après mise à jour

  const { member, loading: loadingMember, error: errorMember } = useGetMember(memberId);
  const { updateMember } = useUpdateMember();
  
  const [memberUpdate, setMemberUpdate] = useState({
    firstName: "",
    lastName: "",
  }); // Informations du membre
  const [error, setError] = useState(""); // Message d'erreur
  const [successMessage, setSuccessMessage] = useState(""); // Message de succès

  useEffect(() => {
    if (member) {
      setMemberUpdate({
        lastName: member.lastName,
        firstName: member.firstName
      });
    }
  }, [member]);
  
  // Affichage de l'état de chargement ou des erreurs
  if (loadingMember) {
    return <div className="text-center">Chargement...</div>;
  }

  if (errorMember) {
    return <div className="text-center text-red-600">Erreur lors du chargement du membre.</div>;
  }

  // Gestion des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberUpdate({ ...memberUpdate, [name]: value });
  };


  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberUpdate.lastName.trim() || !memberUpdate.firstName.trim()) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }

    try {
      await updateMember(memberId, memberUpdate);
      setError("");
      setSuccessMessage("Le member a été mise à jour avec succès.");
      setTimeout(() => {
        navigate(`/members/${memberId}`); // Redirection après un court délai
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de lu membre :", error);
      setError("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <div className='lg:pl-72'>
    <div className="pt-8 pb-16 bg-white antialiased px-4">
      <h1 className="text-base font-semibold text-gray-900">
        Mettre à jour le membre : {memberUpdate.firstName} - {memberUpdate.lastName}
      </h1>

      {/* Messages de feedback */}
      {error && <div className="mt-2 text-red-600">{error}</div>}
      {successMessage && <div className="mt-2 text-green-600">{successMessage}</div>}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/* Nom */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={memberUpdate.lastName}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        {/* Prénom */}
        <div className="mt-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
            Prénom
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={memberUpdate.firstName}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="mt-6 block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
        >
          Mettre à jour
        </button>
      </form>
    </div>
    </div>
  );
}
