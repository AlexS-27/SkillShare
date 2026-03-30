import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

export default function Account() {
    const navigate = useNavigate();
    // On récupère les infos depuis le localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { pseudo: 'Utilisateur inconnu', balance: 0 }; // J'ai remplacé "soldes" par "balance" pour coller à la BDD

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

        // 2. Nettoyer tout le localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // <-- Le grand coupable était ici !

        // 3. Rediriger
        navigate('/login');
    };

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold mb-6 w-full max-w-lg text-left">Mon compte</h1>

            <div className="border border-gray-200 rounded-lg p-6 w-full max-w-lg shadow-sm">
                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div className="bg-[#0b0f19] text-white p-4 rounded-full">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Bienvenue, {user.username}</h2>
                        <p className="text-sm text-gray-500">Membre de SkillShare</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Pseudo</label>
                        <div className="bg-gray-100 border border-transparent rounded-md p-3 text-gray-700">
                            {user.username}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                            🔗 Balance de jetons
                        </label>
                        <div className="bg-gray-100 border border-transparent rounded-md p-3 text-gray-900 font-bold text-lg flex justify-between items-center">
                            <span>{user.balance || 150}</span>
                            <span className="text-sm font-normal text-gray-500">jetons</span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#d32f2f] text-white font-medium py-3 rounded-md flex justify-center items-center gap-2 hover:bg-red-800 transition-colors cursor-pointer"
                    >
                        <LogOut size={18} />
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}