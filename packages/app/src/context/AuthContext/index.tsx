import React, { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { makeGraphQLQuery } from '../../dataservice';

const refreshAccessTokenQuery = `
query {
    refreshAccessToken {
        accessToken
    }
}
`;

interface AuthContextProps {
    token: string;
    isFetchingToken: boolean;
    login: (t: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextProps>({
    token: '',
    isFetchingToken: false,
    login: (t: string) => {},
    logout: () => {}
});

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [token, setToken] = useState<string>('');

    const { isLoading: isFetchingToken } = useQuery(
        ['refreshToken', { query: refreshAccessTokenQuery }],
        makeGraphQLQuery,
        {
            refetchInterval: 1000 * 60 * 8, // refresh access token every 8 minutes
            onSuccess: (response) => {
                if (response) {
                    const { accessToken } = response.data?.refreshAccessToken;
                    if (accessToken) {
                        console.log('[Auth] Updating access token');
                        setToken(accessToken);
                    }
                }
            }
        }
    );

    const login = (t: string) => {
        setToken(t);
    };

    const logout = () => {
        setToken('');
    };

    return (
        <AuthContext.Provider value={{ token, isFetchingToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
