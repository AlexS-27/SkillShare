import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    // Données factices basées sur la maquette
    const services = [
        { id: 1, vendeur: 'Marie Dubois', description: 'Création de sites web professionnels avec React et Tailwind', prix: 50 },
        { id: 2, vendeur: 'Jean Martin', description: 'Cours de guitare pour débutants et intermédiaires', prix: 15 },
        { id: 3, vendeur: 'Sophie Laurent', description: 'Design graphique et création de logos', prix: 30 },
        { id: 4, vendeur: 'Pierre Moreau', description: 'Consulting en marketing digital et SEO', prix: 40 },
        { id: 5, vendeur: 'Emma Bernard', description: 'Traduction français-anglais pour documents professionnels', prix: 25 },
        { id: 6, vendeur: 'Lucas Petit', description: 'Développement d\'applications mobiles iOS et Android', prix: 60 },
    ];

    const handleAcheter = () => {
        // Vérifier si l'utilisateur est connecté avant l'achat
        if (!localStorage.getItem('user')) {
            navigate('/login');
        } else {
            alert("Fonctionnalité d'achat à implémenter !");
        }
    };

    return (
        <div className="mt-8">
            <h1 className="text-2xl font-bold mb-6">Services disponibles</h1>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-4 font-semibold">Vendeur</th>
                        <th className="p-4 font-semibold">Description du service</th>
                        <th className="p-4 font-semibold">Prix (jetons)</th>
                        <th className="p-4 font-semibold">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {services.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-800">{service.vendeur}</td>
                            <td className="p-4 text-gray-600">{service.description}</td>
                            <td className="p-4 text-gray-800">{service.prix}</td>
                            <td className="p-4">
                                <button
                                    onClick={handleAcheter}
                                    className="bg-[#0b0f19] text-white px-4 py-2 rounded-md font-medium text-xs hover:bg-gray-800 transition-colors"
                                >
                                    Acheter
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}