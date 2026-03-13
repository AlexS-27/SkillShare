import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    if (!user) {
        // Si pas d'utilisateur dans le storage, on redirige vers le login
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-white font-sans text-gray-900">
                <Header />
                <main className="max-w-5xl mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <Account />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;