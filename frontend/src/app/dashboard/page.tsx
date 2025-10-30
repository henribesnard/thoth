'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, removeAuthToken } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">THOTH Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenue sur THOTH !</h2>
          <p className="text-gray-600 mb-4">
            Vous êtes maintenant connecté à votre assistant d&apos;écriture littéraire.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Projets */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="text-lg font-semibold mb-2">Projets</h3>
              <p className="text-gray-600 text-sm mb-4">
                Gérez vos projets d&apos;écriture
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Voir les projets →
              </button>
            </div>

            {/* Documents */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <p className="text-gray-600 text-sm mb-4">
                Accédez à vos chapitres et notes
              </p>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                Voir les documents →
              </button>
            </div>

            {/* Personnages */}
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-lg font-semibold mb-2">Personnages</h3>
              <p className="text-gray-600 text-sm mb-4">
                Créez et gérez vos personnages
              </p>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Voir les personnages →
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🚧 En développement</h3>
            <p className="text-yellow-700 text-sm">
              Le dashboard complet est en cours de développement. Pour l&apos;instant, vous pouvez tester
              l&apos;API backend via Swagger :
              <a
                href="http://localhost:8001/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline hover:text-yellow-900"
              >
                http://localhost:8001/api/docs
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
