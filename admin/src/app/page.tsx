export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">AROHAN Platform Admin</h1>
        <p className="text-neutral-400 text-lg mb-8">Platform Management Dashboard</p>
        <div className="space-x-4">
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
          >
            Go to Admin Dashboard
          </a>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
