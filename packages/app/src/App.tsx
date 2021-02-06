import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import LoginPage from './containers/LoginPage';
import UserRegisterPage from './containers/UserRegisterPage';
import UserListPage from './containers/UserListPage';
import Layout from './containers/Layout';
import Home from './containers/Home';

const queryClient = new QueryClient();

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/login">
                            <LoginPage />
                        </Route>
                        <Route exact path="/register">
                            <UserRegisterPage />
                        </Route>
                        <Route exact path="/users">
                            <UserListPage />
                        </Route>
                    </Switch>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Layout>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
