import React, { useState, useContext } from 'react';
import { useMutation } from 'react-query';
import { makeGraphQLMutation } from '../../dataservice';
import { useInterval } from '../../hooks/useInterval';

const refreshAccessTokenOp = `
mutation RefresAccessToken {
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
    isFetchingToken: true,
    login: (t: string) => {},
    logout: () => {}
});

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [token, setToken] = useState<string>('');

    const { mutate, isLoading: isFetchingToken } = useMutation(makeGraphQLMutation, {
        onSuccess: (response) => {
            if (response) {
                const { accessToken } = response.data?.refreshAccessToken;
                if (accessToken) {
                    setToken(accessToken);
                }
            }
        }
    });

    useInterval(
        () => {
            mutate({
                query: refreshAccessTokenOp,
                variables: {}
            });
        },
        1000 * 60,
        { executeImmediate: true }
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
