import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import SearchInput from "../../components/SearchInput";
import { useGetMembers, useDeleteMember } from "../../hooks/useMembers";
import { useGetMonths } from "../../hooks/useMonths";

export default function Members() {
  const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
  const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();
  const { deleteMember, loading: deleting, error: deleteError } = useDeleteMember();

  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Tableau des mois triés
  const monthOrder = ["Janvier", "Février", "Mars", "Avril", "Mai",
    "Juin", "Juillet", "Août", "Septembre","Octobre", "Novembre", "Décembre"
  ];

  const filteredMonths = months
    .filter((month) => month.year === selectedYear)
    .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

  // Filtrer les catégories en fonction de la recherche
  useEffect(() => {
    if (members) {
      const filtered = members.filter((member) =>
        member.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]); // Met à jour uniquement lorsque `searchQuery` ou `categories` change
  
  // Supprime un membre
  const handleDelete = async (id) => {
    try {
      await deleteMember(id);

      // Met à jour localement la liste des catégories filtrées
      setFilteredMembers((prev) =>
        prev.filter((member) => member.id !== id)
      );
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  // Calcul du montant des cotisations pour un membre sur un mois donné
  const getMemberDuesAmount = (member, month) => {
    return member.dues.reduce(
      (total, due) => (due.monthId === month.id ? total + due.amount : total),
      0
    );
  };

  // Gestion des états de chargement et des erreurs
  if (loadingMembers || loadingMonths) {
    return <div className="text-center">Chargement...</div>;
  }

  if (errorMembers || errorMonths || deleteError) {
    return (
      <div className="text-center text-red-600">
        {errorMembers || errorMonths || deleteError}
      </div>
    );
  }

  return (
    <div className='lg:pl-72'>
      <div className="pt-8 pb-16 bg-white antialiased">
        {filteredMembers.length > 0 && filteredMonths ? (
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold text-gray-900">Liste des membres</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    Voici la liste des membres de l'association.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <Link
                    to="/members/add"
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    Ajouter un membre
                  </Link>
                </div>
              </div>

              {/* Barre de recherche */}
              <SearchInput
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un membre"
              />
            </div>

            {/* Navigation des années */}
            <div className="mt-6 flex justify-center space-x-4">
              {years.sort((a, b) => a - b).map((year) => (
                <button
                  key={`year-${year}`}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 text-sm font-medium ${
                    year === selectedYear
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } rounded-md`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Tableau des cotisations */}
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Nom
                          </th>
                          {filteredMonths.map((month) => (
                            <th
                              key={`month-${month.id}`}
                              scope="col"
                              className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                            >
                              {month.name} {month.year}
                            </th>
                          ))}
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredMembers.map((member) => (
                          <tr key={`member-${member.id}`}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <Link to={`/members/${member.id}`}>
                                {member.firstName} {member.lastName}
                              </Link>
                            </td>
                            {filteredMonths.map((month) => (
                              <td
                                key={`member-${member.id}-month-${month.id}`}
                                className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                              >
                                {getMemberDuesAmount(member, month)} €
                              </td>
                            ))}
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleDelete(member.id)}
                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                disabled={deleting}
                              >
                                Supprimer
                              </button>
                              <Link
                                to={`/members/${member.id}`}
                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer ml-4"
                              >
                                Voir les infos
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">Pas de membres ou de mois trouvés.</div>
        )}
      </div>
    </div>
  );
}
