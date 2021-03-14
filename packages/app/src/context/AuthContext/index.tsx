import React, { useState, useContext } from 'react';
import { useMutation } from 'react-query';
import { GraphQLResponse, makeGraphQLMutation } from '../../dataservice';
import { useInterval } from '../../hooks/useInterval';
import useLogout from '../../hooks/useLogout';

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

    const { mutate: doRefresh, isLoading: isFetchingToken } = useMutation(makeGraphQLMutation);
    const { mutate: doLogout } = useLogout({
        onSuccess: () => {
            setToken('');
        }
    });

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

    const logout = () => {
        doLogout({
            query: logoutOp,
            variables: {}
        });
    };

    return (
        <AuthContext.Provider value={{ token, isFetchingToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
