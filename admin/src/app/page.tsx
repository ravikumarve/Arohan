export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-background-primary">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          AROHAN Platform Admin
        </h1>
        <p className="text-admin-primary-light text-lg mb-8">
          Platform Management Dashboard
        </p>
        <div className="space-x-4">
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-admin-primary hover:bg-admin-primary-dark text-white rounded-lg transition-colors"
          >
            Go to Admin Dashboard
          </a>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-admin-background-tertiary hover:bg-admin-background-secondary text-white rounded-lg transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
