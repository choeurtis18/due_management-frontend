import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useGetMember } from "../../hooks/useMembers";
import { useGetCategories } from "../../hooks/useCategories";
import { useGetMonths } from "../../hooks/useMonths";

export default function Member() {
  const { id } = useParams();
  const memberId = parseInt(id);

  const { member, loading: loadingMember, error: errorMember } = useGetMember(memberId);
  const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
  const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Année sélectionnée

  // Tri des mois par ordre
  const monthOrder = ["Janvier",  "Février",  "Mars",  "Avril",  "Mai",  "Juin",  "Juillet",  
    "Août",  "Septembre",  "Octobre",  "Novembre",  "Décembre"
  ];

  // Filtrer et trier les mois en fonction de l'année sélectionnée
  const filteredMonths = useMemo(() => {
    return months
      ?.filter((month) => month.year === selectedYear)
      .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
  }, [months, selectedYear]);

  /**
   * Formate une date en une chaîne lisible.
   */
  const formatDate = (date) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const monthsNames = ["Janvier",  "Février",  "Mars",  "Avril",  "Mai",  "Juin",  "Juillet",  
      "Août",  "Septembre",  "Octobre",  "Novembre",  "Décembre"
    ];

    const d = new Date(date);
    const dayName = days[d.getDay()];
    const day = d.getDate();
    const monthName = monthsNames[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${dayName} ${day} ${monthName} ${year} - ${hours}h${minutes}`;
  };

  if (loadingMember || loadingCategories || loadingMonths) {
    return <div className="text-center">Chargement des données...</div>;
  }

  if (errorMember || errorCategories || errorMonths) {
    return (
      <div className="text-center text-red-600">
        Une erreur est survenue lors du chargement des données.
      </div>
    );
  }

  return (
    <div className='lg:pl-72'>
    <div className="pt-8 pb-16 bg-white antialiased">
      {member ? (
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold text-gray-900">
                {member.firstName} {member.lastName}
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Dernière mise à jour : {formatDate(member.update_date)}
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                to={`/members/${memberId}/update`}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Mettre à jour
              </Link>
            </div>
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

          {/* Tableau des mois et cotisations */}
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
                          Mois de cotisation
                        </th>
                        {categories.map((category) => (
                          <th
                            key={`category-${category.id}`}
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            {category.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredMonths.map((month) => (
                        <tr key={`month-${month.id}`}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {month.name} {month.year}
                          </td>
                          {categories.map((category) => (
                            <td
                              key={`month-${month.id}-category-${category.id}`}
                              className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                            >
                              {member.dues.find(
                                (due) =>
                                  due.monthId === month.id &&
                                  due.categoryId === category.id
                              )?.amount || "0"}{" "}
                              €
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
        <div className="text-center">Membre introuvable.</div>
      )}
    </div>
    </div>
  );
}
