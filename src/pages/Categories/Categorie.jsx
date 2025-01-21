import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import SearchInput from "../../components/SearchInput";

import { useGetCategory } from "../../hooks/useCategories";
import { useGetMonths } from "../../hooks/useMonths";
import { useGetMembers } from "../../hooks/useMembers";

export default function Categorie() {
  const { id } = useParams();
  const categoryId = parseInt(id);

  const { category, loading: loadingCategory, error: errorCategory } = useGetCategory(categoryId);
  const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
  const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();

  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filtrer les membres par recherche
  useEffect(() => {
    if (members) {
      const filtered = members.filter(
        (member) =>
          member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  // Mois filtrés par année sélectionnée
    const monthOrder = ["Janvier",  "Février",  "Mars",  "Avril",  "Mai",  "Juin",  "Juillet",  
        "Août",  "Septembre",  "Octobre",  "Novembre",  "Décembre"
    ];

  const filteredMonths = months
    .filter((month) => month.year === selectedYear)
    .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

  /**
   * Formate une date en une chaîne lisible.
   */
  function formatDate(date) {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months = ["Janvier",  "Février",  "Mars",  "Avril",  "Mai",  "Juin",  "Juillet",  
        "Août",  "Septembre",  "Octobre",  "Novembre",  "Décembre"
    ];

    const d = new Date(date);
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  if (loadingCategory || loadingMembers || loadingMonths) {
    return <div className="text-center">Chargement...</div>;
  }

  if (errorCategory || errorMembers || errorMonths) {
    return <div className="text-center text-red-600">Erreur lors du chargement des données.</div>;
  }

  return (
    <div className='lg:pl-72'>
    <div className="pt-8 pb-16 bg-white antialiased">
      {category ? (
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold text-gray-900">{category.name}</h1>
                <p className="text-sm text-gray-700">
                  Dernière mise à jour le {formatDate(category.update_date)}
                </p>
                <p className="mt-2 text-sm">{category.description}</p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Link
                  to={`/categories/${categoryId}/update`}
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Mettre à jour
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
                          Membres
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
                              key={`category-${category.id}-month-${month.id}`}
                              className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                            >
                              {member.dues.find((due) => 
                                due.monthId === month.id &&
                                due.categoryId === categoryId
                              )?.amount || "0"} €
                            </td>
                          ))}
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
        <div className="text-center">Catégorie introuvable.</div>
      )}
    </div>
    </div>
  );
}
