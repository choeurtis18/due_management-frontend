import { useState, useEffect } from 'react';
import { Dues } from '../../types.ts';

// Base URL de l'API
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/dues`;
const jwt_token = localStorage.getItem('token'); 

// Hook pour récupérer toutes les cotisations
export const useGetDues = () => {
    const [dues, setDues] = useState<Dues[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDues = async () => {
            try {
                const response = await fetch(API_BASE_URL, {
                    headers: {
                        'Authorization': `Bearer ${jwt_token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch dues');
                }
                const data: Dues[] = await response.json();
                setDues(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchDues();
    }, []);

    return { dues, loading, error };
};

// Hook pour récupérer une cotisation spécifique par ID
export const useGetDue = (id: number) => {
    const [due, setDue] = useState<Dues | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDue = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch due');
                }
                const data: Dues = await response.json();
                setDue(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchDue();
    }, [id]);

    return { due, loading, error };
};

// Hook pour ajouter une nouvelle cotisation
export const useAddDue = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addDue = async (newDue: Partial<Dues>): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                },
                body: JSON.stringify(newDue),
            });

            if (!response.ok) {
                throw new Error('Failed to add due');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { addDue, loading, error };
};

// Hook pour mettre à jour une cotisation
export const useUpdateDue = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateDue = async (id: number, updatedDue: Partial<Dues>): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                },
                body: JSON.stringify(updatedDue),
            });

            if (!response.ok) {
                throw new Error('Failed to update due');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { updateDue, loading, error };
};

// Hook pour supprimer une cotisation
export const useDeleteDue = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDue = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt_token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete due');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { deleteDue, loading, error };
};
