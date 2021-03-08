import React, { useState, useContext } from 'react';
import { useMutation } from 'react-query';
import { GraphQLResponse, makeGraphQLMutation } from '../../dataservice';
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
    login: (t: string, cb?: () => void) => void;
    logout: (cb?: () => void) => void;
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

    const { mutate: doRefresh, isLoading: isFetchingToken } = useMutation(makeGraphQLMutation);
    const { mutate: doLogout } = useMutation(makeGraphQLMutation);

    const handleRefreshSuccess = (response: GraphQLResponse) => {
        if (response) {
            const { accessToken } = response.data?.refreshAccessToken;
            if (accessToken) {
                setToken(accessToken);
            }
        }
    };

    useInterval(
        () => {
            doRefresh(
                {
                    query: refreshAccessTokenOp,
                    variables: {}
                },
                {
                    onSuccess: handleRefreshSuccess
                }
            );
        },
        1000 * 60 * 8, // every 8 mins
        { executeImmediate: true }
    );

    const login = (t: string, cb?: () => void) => {
        setToken(t);
        if (cb) {
            cb();
        }
    };

    const logout = (cb?: () => void) => {
        doLogout(
            {
                query: logoutOp,
                variables: {}
            },
            {
                onSuccess: () => {
                    setToken('');
                    if (cb) {
                        cb();
                    }
                }
            }
        );
    };

    return (
        <AuthContext.Provider value={{ token, isFetchingToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
