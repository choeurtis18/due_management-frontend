import { useState, useEffect } from 'react';
import { Member } from '../../types.ts';

// Base URL de l'API
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/members`;
const jwt_token = localStorage.getItem('token'); 

// Hook pour récupérer tous les membres
export const useGetMembers = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(API_BASE_URL, {
                    headers: {
                        'Authorization': `Bearer ${jwt_token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch members');
                }
                const data: Member[] = await response.json();
                setMembers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return { members, loading, error };
};

// Hook pour récupérer un membre spécifique par ID
export const useGetMember = (id: number) => {
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch member');
                }
                const data: Member = await response.json();
                setMember(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id]);

    return { member, loading, error };
};

// Hook pour ajouter un nouveau membre
export const useAddMember = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addMember = async (newMember: Partial<Member>): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                },
                body: JSON.stringify(newMember),
            });

            if (!response.ok) {
                throw new Error('Failed to add member');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { addMember, loading, error };
};

// Hook pour mettre à jour un membre
export const useUpdateMember = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateMember = async (id: number, updatedMember: Partial<Member>): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                },
                body: JSON.stringify(updatedMember),
            });

            if (!response.ok) {
                throw new Error('Failed to update member');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { updateMember, loading, error };
};

// Hook pour supprimer un membre
export const useDeleteMember = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteMember = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt_token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete member');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { deleteMember, loading, error };
};
