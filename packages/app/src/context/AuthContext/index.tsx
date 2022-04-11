import React, { useState, useContext } from 'react';
import { GraphQLResponse } from '../../dataservice';
import { useInterval } from '../../hooks/useInterval';
import useLogout from '../../hooks/useLogout';
import useRefreshAccessToken from '../../hooks/useRefreshAccessToken';
import { ContextUserInfo, LoginResponseData } from '../../types';

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
    user: ContextUserInfo;
    login: (data: LoginResponseData, cb?: () => void) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const defaultUserInfo: ContextUserInfo = {
    id: '',
    firstName: '',
    lastName: '',
    displayName: ''
};

const AuthContext = React.createContext<AuthContextProps>({
    token: '',
    isFetchingToken: true,
    user: defaultUserInfo,
    login: () => {
        /* empty */
    },
    logout: () => {
        /* empty */
    }
});

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [token, setToken] = useState<string>('');
    const [user, setUser] = useState<ContextUserInfo>(defaultUserInfo);

    const { mutate: doRefresh, isLoading: isFetchingToken } = useRefreshAccessToken();
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
            } else {
                localStorage.removeItem('hasToken');
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
                    // need to handle onSuccess here as part of the options of the actual
                    // mutate function instead of setting up the handler when the hook is
                    // invoked.  Don't know exactly why, but suspect it may be because we
                    // have some different hooks at play with this scenario
                    onSuccess: handleRefreshSuccess
                }
            );
        },
        1000 * 60 * 8, // every 8 mins
        { executeImmediate: true }
    );

    const login = (data: LoginResponseData, cb?: () => void) => {
        localStorage.setItem('hasToken', 'true');
        setToken(data.accessToken);
        if (data.userInfo) {
            setUser(data.userInfo);
        }
        if (cb) {
            cb();
        }
    };

    const logout = () => {
        doLogout({
            query: logoutOp,
            variables: {}
        });
        setToken('');
        setUser(defaultUserInfo);
        localStorage.removeItem('hasToken');
    };

    return (
        <AuthContext.Provider value={{ token, user, isFetchingToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
