import React, { useState, useContext } from 'react';

interface AuthContextProps {
    token: string;
    login: (t: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextProps>({
    token: '',
    login: (t: string) => {},
    logout: () => {}
});

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [token, setToken] = useState<string>('');
    const login = (t: string) => {
        setToken(t);
    };

    const logout = () => {
        setToken('');
    };

    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
