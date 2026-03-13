import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function Header() {
    // On récupère le pseudo s'il est connecté (stocké lors du login)
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <header className="bg-[#0b0f19] text-white py-4 px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <div className="bg-white text-[#0b0f19] rounded px-1 text-sm font-black">SS</div>
                SkillShare
            </Link>

            <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                <User size={24} />
                {user && <span className="text-sm hidden sm:block">{user.pseudo}</span>}
            </Link>
        </header>
    );
}