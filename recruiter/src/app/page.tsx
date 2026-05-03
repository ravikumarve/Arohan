export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-recruiter-background-primary">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          AROHAN Recruiter Dashboard
        </h1>
        <p className="text-recruiter-primary-light text-lg mb-8">
          Employer Hiring Workflows
        </p>
        <div className="space-x-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-recruiter-primary hover:bg-recruiter-primary-dark text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </a>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-recruiter-background-tertiary hover:bg-recruiter-background-secondary text-white rounded-lg transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
