import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Role {
    role_id: number;
    name: string;
}

class AuthService {
    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth-token');
        }
        return null;
    }

    async getAllRoles(): Promise<Role[]> {
        const token = this.getToken();
        const response = await axios.get(`${API_URL}/roles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
}

export const authService = new AuthService(); 