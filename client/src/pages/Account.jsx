import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

export default function Account() {
    const navigate = useNavigate();
    // On récupère les infos depuis le localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { pseudo: 'Utilisateur inconnu', soldes: 0 };

    const handleLogout = () => {
        localStorage.removeItem('user');
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
                        <h2 className="text-xl font-bold">Bienvenue, {user.pseudo}</h2>
                        <p className="text-sm text-gray-500">Membre de SkillShare</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Pseudo</label>
                        <div className="bg-gray-100 border border-transparent rounded-md p-3 text-gray-700">
                            {user.pseudo}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                            🔗 Balance de jetons
                        </label>
                        <div className="bg-gray-100 border border-transparent rounded-md p-3 text-gray-900 font-bold text-lg flex justify-between items-center">
                            <span>{user.soldes || 150}</span>
                            <span className="text-sm font-normal text-gray-500">jetons</span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#d32f2f] text-white font-medium py-3 rounded-md flex justify-center items-center gap-2 hover:bg-red-800 transition-colors"
                    >
                        <LogOut size={18} />
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}