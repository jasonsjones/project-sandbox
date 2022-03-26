import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import LoginPage from './containers/LoginPage';
import UserRegisterPage from './containers/UserRegisterPage';
import UserListPage from './containers/UserListPage';
import Layout from './containers/Layout';
import Home from './containers/Home';
import ProtectedRoute from './components/ProtectedRoute';
import UserDetailPage from './containers/UserDetailPage';

const queryClient = new QueryClient();

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<UserRegisterPage />} />
                        <Route
                            path="/users/:id"
                            element={
                                <ProtectedRoute>
                                    <UserDetailPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute>
                                    <UserListPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Layout>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
