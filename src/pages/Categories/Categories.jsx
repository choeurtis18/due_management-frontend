import React, { useState, useEffect } from "react";
import SearchInput from "../../components/SearchInput";
import { useGetMonths } from "../../hooks/useMonths";
import { useGetCategories, useDeleteCategory } from "../../hooks/useCategories";
import { Link } from "react-router-dom";

export default function Categories() {
    const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();
    const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
    const { deleteCategory } = useDeleteCategory();

    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Filtrer les catégories en fonction de la recherche
    useEffect(() => {
        if (categories) {
            const filtered = categories.filter((category) =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [searchQuery, categories]); // Met à jour uniquement lorsque `searchQuery` ou `categories` change

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);

            // Met à jour localement la liste des catégories filtrées
            setFilteredCategories((prev) =>
                prev.filter((category) => category.id !== id)
            );
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const getCategoryDuesAmount = (category, month) => {
        return category.dues.reduce(
            (total, due) => (due.monthId === month.id ? total + due.amount : total),
            0
        );
    };

    if (loadingMonths || loadingCategories) {
        return <div className="pt-8 pb-16 px-4 bg-white antialiased">Chargement...</div>;
    }

    if (errorMonths || errorCategories) {
        return (
            <div className="pt-8 pb-16 px-4 bg-white antialiased text-red-600">
                {errorCategories || errorMonths}
            </div>
        );
    }

    const monthOrder = ["Janvier",  "Février",  "Mars",  "Avril",  "Mai",  "Juin",  "Juillet",  
        "Août",  "Septembre",  "Octobre",  "Novembre",  "Décembre"];

    const filteredMonths = months
        .filter((month) => month.year === selectedYear)
        .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

    return (
        <div className="lg:pl-72">
            <div className="pt-8 pb-16 bg-white antialiased">
                {filteredCategories && months ? (
                    <div className="px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="flex flex-col">
                            <div className="sm:flex sm:items-center">
                                <div className="sm:flex-auto">
                                    <h1 className="text-base font-semibold text-gray-900">Liste des tontines</h1>
                                    <p className="mt-2 text-sm text-gray-700">
                                        Voici la liste des tontines de l'association.
                                    </p>
                                </div>
                                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                    <Link
                                        to={"/categories/add"}
                                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                    >
                                        Ajouter une tontine
                                    </Link>
                                </div>
                            </div>

                            {/* Barre de recherche */}
                            <SearchInput
                                searchQuery={searchQuery}
                                onSearchChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher une catégorie"
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
                                                        Nom
                                                    </th>
                                                    {filteredMonths.map((month) => (
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                            key={`month-${month.id}`}
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
                                                {filteredCategories.map((category) => (
                                                    <tr key={`category-${category.id}`}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <a href={`/categories/${category.id}`}>{category.name}</a>
                                                        </td>
                                                        {filteredMonths.map((month) => (
                                                            <td
                                                                className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                                                                key={`month-${month.id}`}
                                                            >
                                                                {getCategoryDuesAmount(category, month)} €
                                                            </td>
                                                        ))}
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <div
                                                                onClick={() => handleDelete(category.id)}
                                                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                                            >
                                                                Supprimer
                                                            </div>
                                                            <a
                                                                href={`/categories/${category.id}`}
                                                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                            >
                                                                Voir les infos
                                                            </a>
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
                    <div className="text-center">Pas de catégories ou de mois trouvés</div>
                )}
            </div>
        </div>
    );
}
