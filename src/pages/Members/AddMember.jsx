import { useState } from 'react';
import { useAddMember } from '../../hooks/useMembers';

export default function AddMember() {
    const { addMember } = useAddMember(); // Hook pour ajouter un membre
    const [member, setMember] = useState({
        firstName: '',
        lastName: '',
    }); // État pour les données du membre
    const [error, setError] = useState(''); // Message d'erreur
    const [successMessage, setSuccessMessage] = useState(''); // Message de succès

    // Gestion des changements dans les champs de saisie
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMember({ ...member, [name]: value });
    };

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation des champs
        if (!member.firstName.trim() || !member.lastName.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            await addMember(member); // Appel pour ajouter un membre
            setError('');
            setSuccessMessage('Le membre a été ajouté avec succès !');

            // Réinitialise le formulaire après succès
            setMember({ firstName: '', lastName: '' });

            // Redirection après un court délai
            setTimeout(() => {
                window.location.href = '/members';
            }, 1500);
        } catch (err) {
            console.error('Erreur lors de l’ajout du membre :', err);
            setError("Une erreur s'est produite. Veuillez réessayer.");
        }
    };

    return (
        <div className='lg:pl-72'>
        <div className="pt-8 pb-16 bg-white antialiased px-4">
            <h1 className="text-lg font-semibold text-gray-900">Ajouter un membre</h1>

            {/* Affichage des messages */}
            {error && <div className="mt-4 text-sm text-red-600" role="alert">{error}</div>}
            {successMessage && <div className="mt-4 text-sm text-green-600" role="alert">{successMessage}</div>}

            {/* Formulaire d'ajout de membre */}
            <form onSubmit={handleSubmit} className="mt-4">
                {/* Champ pour le nom */}
                <div className="mt-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                        Nom
                    </label>
                    <div className="mt-2">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Jackson"
                            value={member.lastName}
                            onChange={handleInputChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                </div>

                {/* Champ pour le prénom */}
                <div className="mt-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                        Prénom
                    </label>
                    <div className="mt-2">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Michael"
                            value={member.firstName}
                            onChange={handleInputChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                </div>

                {/* Bouton pour soumettre */}
                <button
                    type="submit"
                    className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Ajouter le membre
                </button>
            </form>
        </div>
        </div>
    );
}
