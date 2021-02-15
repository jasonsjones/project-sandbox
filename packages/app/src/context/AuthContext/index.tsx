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

const logoutOp = `
mutation Logout {
    logout
}`;

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

    const { mutate: doLogout } = useMutation(makeGraphQLMutation);

    useInterval(
        () => {
            mutate({
                query: refreshAccessTokenOp,
                variables: {}
            });
        },
        1000 * 60 * 9, // every 9 mins
        { executeImmediate: true }
    );

    const login = (t: string) => {
        setToken(t);
    };

    const logout = () => {
        doLogout({
            query: logoutOp,
            variables: {}
        });
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
