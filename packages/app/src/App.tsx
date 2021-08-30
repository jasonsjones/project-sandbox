import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import LoginPage from './containers/LoginPage';
import UserRegisterPage from './containers/UserRegisterPage';
import UserPage from './containers/UserPage';
import Layout from './containers/Layout';
import Home from './containers/Home';
import ProtectedRoute from './components/ProtectedRoute';

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
                        <ProtectedRoute exact path="/users">
                            <UserPage />
                        </ProtectedRoute>
                    </Switch>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Layout>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
