import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetMembers } from "../../hooks/useMembers";
import { useGetMonths, useAddMonth } from "../../hooks/useMonths";
import { useGetCategories } from "../../hooks/useCategories";
import { useUpdateDue } from "../../hooks/useDues";

export default function Dues() {
    const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
    const { months, years, loading: loadingMonths, error: errorMonths, refetch: refetchMonths } = useGetMonths();
    const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
    const { updateDue } = useUpdateDue();
    const { addMonth } = useAddMonth();

    const yearsChoices = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2030"];
    const monthsChoices = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const [filteredMembers, setFilteredMembers] = useState([]);
    const [filteredMonth, setFilteredMonth] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Initialiser les membres filtrés
    useEffect(() => {
        setFilteredMembers(members || []);

        const store_month = localStorage.getItem("selectedMonth", selectedMonth);
        const store_year = localStorage.getItem("selectedYear", selectedYear);
        if(store_month && store_year) {
            setSelectedMonth(store_month);
            setSelectedYear(store_year);

            localStorage.removeItem("selectedMonth");
            localStorage.removeItem("selectedYear");
        }
    }, [members]);

    if (loadingMembers || loadingMonths || loadingCategories) {
        return <div className="text-center">Chargement...</div>;
    }

    if (errorMembers || errorMonths || errorCategories) {
        return (
            <div className="text-center text-red-600">
                {errorMembers || errorMonths || errorCategories}
            </div>
        );
    }
    
    const handleSearch = async () => {
        if (!selectedMonth || !selectedYear) {
            setErrorMessage("Veuillez sélectionner un mois et une année.");
            return;
        }
    
        const month = months.find((m) => m.name === selectedMonth && m.year === parseInt(selectedYear));
        if (month) {
            setFilteredMonth(month);
            setErrorMessage("");
        } else {
            try {
                const newMonth = await addMonth({ name: selectedMonth, year: parseInt(selectedYear) });
        
                // Recharge les mois directement après l'ajout
                const updatedMonths = await refetchMonths();
                const addedMonth = updatedMonths.find(
                    (m) => m.name === newMonth.name && m.year === newMonth.year
                );

                if (addedMonth) {
                    localStorage.setItem("selectedMonth", selectedMonth);
                    localStorage.setItem("selectedYear", selectedYear);

                    setFilteredMonth(addedMonth);
                    setErrorMessage("");

                    window.location.reload();
                } else {
                    setErrorMessage("Le mois a été ajouté mais ne peut pas être trouvé dans les données mises à jour.");
                }
            } catch (error) {
                setErrorMessage("Erreur lors de l'ajout du mois.");
                console.error("Détail de l'erreur :", error);
            }
        }
    };
    
    const handleInputChange = (e, memberId, categoryId) => {
        const { value } = e.target;

        setFilteredMembers((prevMembers) =>
            prevMembers.map((member) =>
                member.id === memberId
                    ? {
                        ...member,
                        dues: member.dues.map((due) =>
                            due.categoryId === categoryId && due.monthId === filteredMonth?.id
                                ? { ...due, amount: parseFloat(value) || parseFloat(0) }
                                : due
                        ),
                    }
                    : member
            )
        );
    };

    const handleSubmit = async () => {
        if (!filteredMonth) {
            alert("Veuillez sélectionner un mois avant de soumettre.");
            return;
        }

        try {
            const updates = filteredMembers.map((member) => ({
                id: member.id,
                dues: member.dues.filter((due) => due.monthId === filteredMonth.id),
            }));

            await Promise.all(
                updates.map((update) =>
                    update.dues.map((due) => {
                        updateDue(due.id, due);
                    })
                )
            );
            alert("Cotisations mises à jour avec succès !");
        } catch (error) {
            setErrorMessage("Erreur lors de la mise à jour des cotisations.");
            console.error(error);
        }
    };

    return (
        <div className="lg:pl-72">
            <div className="pt-8 pb-16 bg-white">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold text-gray-900">Liste des cotisations</h1>
                            <p className="mt-2 text-sm text-gray-700">Voici la liste des cotisations de l'association.</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-4">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="block w-full sm:w-auto rounded-md border-2 border-gray-300 p-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner une année</option>
                                {yearsChoices.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                                ))}
                            </select>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="block w-full sm:w-auto rounded-md border-2 border-gray-300 p-2 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner un mois</option>
                                {monthsChoices.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                                ))}
                            </select>
                            <button
                                onClick={handleSearch}
                                className="w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-sm text-white shadow hover:bg-indigo-500"
                            >
                                Chercher
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {errorMessage && <div className="mt-4 text-red-600">{errorMessage}</div>}

                    {/* Table */}
                    {filteredMonth && (
                        <div className="mt-8 flow-root">
                            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nom</th>
                                            {categories.map((category) => (
                                                <th key={category.id} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    {category.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredMembers.map((member) => (
                                            <tr key={member.id}>
                                                <td className="py-2 pl-4 text-sm text-gray-900">
                                                    <Link to={`/members/${member.id}`}>
                                                        {member.firstName} {member.lastName}
                                                    </Link>
                                                </td>
                                                {categories.map((category) => (
                                                    <td key={category.id} className="px-3 py-2">
                                                        <input
                                                            id={member.id}
                                                            type="number"
                                                            value={
                                                                member.dues.find(
                                                                    (due) =>
                                                                        due.categoryId === category.id &&
                                                                        due.monthId === filteredMonth.id
                                                                )?.amount || parseFloat(0)
                                                            }
                                                            onChange={(e) => handleInputChange(e, member.id, category.id)}
                                                            className="block p-2 rounded-md border-gray-300 focus:ring-indigo-500 sm:text-sm"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow hover:bg-indigo-500"
                            >
                                Mettre à jour les cotisations
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
