import { useState, useEffect, useCallback, type ReactNode } from 'react';
import axios from 'axios';
import { AuthContext, type User } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // nodejs const [user, setUser] = useState<User | null>(null);
    // nodejs const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    //Java
    const [authMode, setAuthMode] = useState<'node' | 'java'>(() =>
        localStorage.getItem('authMode') === 'java' ? 'java' : 'node'
    );

    const [user, setUser] = useState<User | null>(() => {
        const savedToken = localStorage.getItem('token');
        const savedAuthMode = localStorage.getItem('authMode');

        if (!savedToken || savedAuthMode !== 'java') {
            return null;
        }

        try {
            const savedUser = localStorage.getItem('javaUser');
            return savedUser ? (JSON.parse(savedUser) as User) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );

    // java
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('authMode');
        localStorage.removeItem('javaUser');

        delete axios.defaults.headers.common['Authorization'];

        setToken(null);
        setUser(null);
        setAuthMode('node');
    }, []);


    const fetchUser = async () => {
        if (!token || authMode === 'java') return;
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${import.meta.env.VITE_API_URL || ''}/auth/me`);
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            logout();
        }
    };

    // nodejs
    // useEffect(() => {
    //     if (token) {
    //         fetchUser();
    //     } else {
    //         delete axios.defaults.headers.common['Authorization'];
    //         setUser(null);
    //     }
    // }, [token]);

    useEffect(() => {
        if (!token) {
            delete axios.defaults.headers.common['Authorization'];
            return;
        }

        if (authMode === 'java') {
            delete axios.defaults.headers.common['Authorization'];
            return;
        }

        let active = true;

        const loadUser = async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL || ''}/auth/me`
                );

                if (active) {
                    setUser(response.data as User);
                }
            } catch (error) {
                if (active) {
                    console.error('Failed to fetch user:', error);
                    logout();
                }
            }
        };

        void loadUser();

        return () => {
            active = false;
        };
    }, [token, authMode, logout]);

    // nodejs
    // const login = (newToken: string) => {
    //     localStorage.setItem('token', newToken);
    //     setToken(newToken);
    // };

    // java
    const login = (newToken: string, newUser?: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);

        if (newUser) {
            // Independent Java authentication
            localStorage.setItem('authMode', 'java');
            localStorage.setItem('javaUser', JSON.stringify(newUser));

            setAuthMode('java');
            setUser(newUser);

            delete axios.defaults.headers.common['Authorization'];
        } else {
            // Existing Node.js authentication remains supported
            localStorage.setItem('authMode', 'node');
            localStorage.removeItem('javaUser');

            setAuthMode('node');
        }
    };

    // nodejs
    // const logout = () => {
    //     localStorage.removeItem('token');
    //     setToken(null);
    //     setUser(null);
    // };

    // java
    // const logout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('authMode');
    //     localStorage.removeItem('javaUser');

    //     delete axios.defaults.headers.common['Authorization'];

    //     setToken(null);
    //     setUser(null);
    //     setAuthMode('node');
    // };

    // nodejs
    // const refreshUser = async () => {
    //     await fetchUser();
    // };

    // java
    const refreshUser = async () => {
        if (authMode === 'java') {
            // Java auth currently has no /api/auth/me endpoint.
            return;
        }

        await fetchUser();
    };

    // nodejs
    // return (
    //     <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isAuthenticated: !!token }}>
    //         {children}
    //     </AuthContext.Provider>
    // );

    // java
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                refreshUser,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

