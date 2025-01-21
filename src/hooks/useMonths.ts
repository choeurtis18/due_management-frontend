import { useState, useEffect } from 'react';
import { Month } from '../../types.ts';

// Base URL de l'API
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/months`;
const jwt_token = localStorage.getItem('token'); 

// Hook pour récupérer tous les mois
export const useGetMonths = () => {
    const [months, setMonths] = useState<Month[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMonths = async (): Promise<Month[]> => {
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL, {
                headers: {
                    'Authorization': `Bearer ${jwt_token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch months");
            }
            const data: Month[] = await response.json();
            setMonths(data);
            setYears(Array.from(new Set(data.map((m) => m.year))));
            setError(null);
            return data; 
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            return []; 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchMonths();
    }, []);

    return { months, years, loading, error, refetch: fetchMonths };
};

// Hook pour récupérer un mois spécifique par ID
export const useGetMonth = (id: number) => {
    const [month, setMonth] = useState<Month | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMonth = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch month');
                }
                const data: Month = await response.json();
                setMonth(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMonth();
    }, [id]);

    return { month, loading, error };
};

// Hook pour ajouter un mois
export const useAddMonth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addMonth = async (newMonth: Partial<Month>): Promise<Month> => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                },
                body: JSON.stringify(newMonth),
            });

            if (!response.ok) {
                throw new Error('Failed to add month');
            }

            // Récupérer et retourner les données du mois ajouté
            const addedMonth: Month = await response.json();
            return addedMonth;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err; // Relance l'erreur pour la gestion dans le composant
        } finally {
            setLoading(false);
        }
    };

    return { addMonth, loading, error };
};

// Hook pour mettre à jour un mois
export const useUpdateMonth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateMonth = async (id: number, updatedMonth: Partial<Month>): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                },
                body: JSON.stringify(updatedMonth),
            });

            if (!response.ok) {
                throw new Error('Failed to update month');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { updateMonth, loading, error };
};

// Hook pour supprimer un mois
export const useDeleteMonth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteMonth = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt_token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete month');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { deleteMonth, loading, error };
};
