export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          THOTH
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Assistant Intelligent d'Écriture Littéraire
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Connexion
          </a>
          <a
            href="/auth/register"
            className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
          >
            Inscription
          </a>
        </div>
      </div>
    </main>
  )
}
