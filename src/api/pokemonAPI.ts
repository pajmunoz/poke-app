const API_BASE_URL = 'http://localhost:3000';   

export interface Pokemon {
    id: number;
    name: string;
    types?: string[];
    image?: string;
    height?: number;
    weight?: number;
    abilities?: string[];
    moves?: Array<{
        name: string;
        type: string;
        power: number | null;
        accuracy: number | null;
    }>;
    forms?: Array<{
        name: string;
        url: string;
    }>;
    stats?: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
        specialAttack: number;
        specialDefense: number;
    };
}

export interface PokemonListResponse {
    count: number;
    total: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

export interface PokemonListParams {
    limit?: number;
    offset?: number;
}

export const getPokemons = async (params: PokemonListParams = {}): Promise<PokemonListResponse> => {
    const { limit = 5, offset = 0 } = params;
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    console.log('🔑 API - Token from localStorage:', token ? 'Token exists' : 'No token');
    console.log('🔑 API - Calling endpoint:', `${API_BASE_URL}/api/pokemon?limit=${limit}&offset=${offset}`);
    
    if (!token) {
        throw new Error('No authentication token found. Please login first.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/pokemon?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('🔑 API - Response status:', response.status);
        console.log('🔑 API - Response ok:', response.ok);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please login again.');
            } else if (response.status === 403) {
                throw new Error('Access forbidden. You do not have permission to access this resource.');
            } else if (response.status === 404) {
                throw new Error('Pokemon endpoint not found.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log('🔑 API - Response data received:', data ? 'Data exists' : 'No data');
        return data;

    } catch (error) {
        console.error('🔑 API - Error in getPokemons:', error);
        throw error;
    }
};

// Función para obtener un Pokémon específico por ID
export const getPokemonById = async (id: number | string): Promise<Pokemon> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No authentication token found. Please login first.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/pokemon/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please login again.');
            } else if (response.status === 404) {
                throw new Error('Pokemon not found.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch pokemon ${id}:`, error);
        throw error;
    }
};

// Función para buscar Pokémon por nombre
export const searchPokemons = async (query: string): Promise<Pokemon> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No authentication token found. Please login first.');
    }

    try {
        // Usar el endpoint correcto: /api/pokemon/search/:name
        const response = await fetch(`${API_BASE_URL}/api/pokemon/search/${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Pokemon "${query}" not found`);
            } else if (response.status === 401) {
                throw new Error('Unauthorized. Please login again.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to search pokemons:', error);
        throw error;
    }
};
