import { useState, useEffect } from 'react';
import { Category } from '../../types.ts';

// Base URL de l'API
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/categories`;
const jwt_token = localStorage.getItem('token'); 

// Hook pour récupérer toutes les catégories
export const useGetCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_BASE_URL, {
                    headers: {
                        'Authorization': `Bearer ${jwt_token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data: Category[] = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};

// Hook pour récupérer une catégorie spécifique par ID
export const useGetCategory = (id: number) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch category');
                }
                const data: Category = await response.json();
                setCategory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    return { category, loading, error };
};

// Hook pour ajouter une nouvelle catégorie
export const useAddCategory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addCategory = async (newCategory: Partial<Category>): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`, 
                },
                body: JSON.stringify(newCategory),
            });

            if (!response.ok) {
                throw new Error('Failed to add category');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { addCategory, loading, error };
};

// Hook pour mettre à jour une catégorie
export const useUpdateCategory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateCategory = async (id: number, updatedCategory: Partial<Category>): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`, 
                },
                body: JSON.stringify(updatedCategory),
            });

            if (!response.ok) {
                throw new Error('Failed to update category');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { updateCategory, loading, error };
};

// Hook pour supprimer une catégorie
export const useDeleteCategory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteCategory = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { deleteCategory, loading, error };
};
