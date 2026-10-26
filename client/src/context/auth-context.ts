import { createContext } from 'react';

export interface User {
    email: string;
    username?: string;
    is_verified: boolean;
    id: string;
    _id?: string;
    isPremium?: boolean;
    subscriptionPlan?: 'monthly' | 'yearly' | null;
    role?: 'user' | 'admin';
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user?: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
