import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Les mots de passe ne correspondent pas');
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('user', JSON.stringify(data.data[0]));
                navigate('/account');
            } else {
                setError(data.message || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            setError('Erreur réseau.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-12">
            <h1 className="text-2xl font-bold mb-6">Inscription</h1>

            <div className="border border-gray-200 rounded-lg p-6 w-full max-w-md shadow-sm">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Pseudo</label>
                        <input
                            type="text"
                            placeholder="Choisissez un pseudo"
                            className="bg-gray-50 border border-gray-200 rounded-md p-2 outline-none focus:border-gray-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Mot de passe</label>
                        <input
                            type="password"
                            placeholder="Créez un mot de passe"
                            className="bg-gray-50 border border-gray-200 rounded-md p-2 outline-none focus:border-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Confirmez le mot de passe</label>
                        <input
                            type="password"
                            placeholder="Confirmez votre mot de passe"
                            className="bg-gray-50 border border-gray-200 rounded-md p-2 outline-none focus:border-gray-400"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="bg-[#0b0f19] text-white font-medium py-2 rounded-md mt-2 hover:bg-gray-800 transition-colors">
                        S'inscrire
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Déjà un compte ? <Link to="/login" className="text-black font-semibold hover:underline">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}