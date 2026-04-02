import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react'; // Ajout de LogOut

export default function Header() {
    const navigate = useNavigate();
    // On récupère le pseudo s'il est connecté (stocké lors du login)
    const user = JSON.parse(localStorage.getItem('user'));

    // Fonction de déconnexion
    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        // 1. Prévenir le serveur d'invalider le token s'il existe
        if (token) {
            try {
                await fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error("Erreur lors de l'appel de déconnexion :", error);
            }
        }

        // 2. Supprimer les informations locales
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // 3. Rediriger vers la page de connexion
        navigate('/login');
    };

    return (
        <header className="bg-[#0b0f19] text-white py-4 px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <div className="bg-white text-[#0b0f19] rounded px-1 text-sm font-black">SS</div>
                SkillShare
            </Link>

            <div className="flex items-center gap-6">
                <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                    <User size={24} />
                    {user ? (
                        <span className="text-sm hidden sm:block">{user.username}</span>
                    ) : (
                        <span className="text-sm hidden sm:block">Se connecter</span>
                    )}
                </Link>

                {/* Bouton de déconnexion affiché uniquement si l'utilisateur est connecté */}
                {user && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Se déconnecter"
                    >
                        <LogOut size={20} />
                        <span className="text-sm hidden sm:block">Déconnexion</span>
                    </button>
                )}
            </div>
        </header>
    );
}