const API_BASE_URL = 'http://localhost:3000';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: {
        id: string;
        username: string;
        email?: string;
    };
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Login request failed:', error);
        throw error;
    }
};

// Test function to send the specific login data you mentioned
export const testLogin = async (): Promise<LoginResponse> => {
    const testCredentials: LoginCredentials = {
        username: 'admin',
        password: 'password'
    };

    console.log('Sending login request to server...');
    console.log('URL:', `${API_BASE_URL}/login`);
    console.log('Data:', testCredentials);

    try {
        const result = await loginUser(testCredentials);
        console.log('Login response:', result);
        return result;
    } catch (error) {
        console.error('Test login failed:', error);
        throw error;
    }
};
