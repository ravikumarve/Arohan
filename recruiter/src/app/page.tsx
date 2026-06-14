export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-2.794 0-5.36-.371-7.721-1.015m13.442-7.27A23.924 23.924 0 0012 5.25c-2.794 0-5.36.371-7.721 1.015M3.938 13.255A23.925 23.925 0 0012 21.75c2.794 0 5.36-.371 7.721-1.015M3.938 13.255A23.925 23.925 0 0112 5.25m0 0a23.925 23.925 0 018.062 7.995" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">AROHAN Recruiter</h1>
        <p className="text-neutral-400 text-lg mb-8">Employer Hiring Workflows</p>
        <div className="space-x-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-medium"
          >
            Go to Dashboard
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
