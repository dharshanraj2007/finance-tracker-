import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-fintech-darker flex flex-col">
      {/* Navbar */}
      <nav className="h-20 border-b border-fintech-border bg-fintech-darker/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-fintech-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-fintech-text font-bold text-xl tracking-wide">SmartFinance</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-fintech-text hover:text-fintech-green transition-colors font-medium">
              Log in
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fintech-green/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-fintech-card border border-fintech-border rounded-full px-4 py-1.5 mb-8">
              <span className="flex w-2 h-2 rounded-full bg-fintech-green animate-pulse"></span>
              <span className="text-sm font-medium text-fintech-textMuted">The future of personal finance</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-fintech-text tracking-tight mb-8 leading-tight">
              Master your money with <span className="text-transparent bg-clip-text bg-gradient-to-r from-fintech-green to-emerald-400">precision.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-fintech-textMuted mb-12 max-w-2xl mx-auto leading-relaxed">
              Track expenses, monitor income, and achieve your financial goals with our beautifully designed, intelligent dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register" className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg w-full sm:w-auto justify-center rounded-xl">
                <span>Start for free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-secondary flex items-center space-x-2 px-8 py-4 text-lg w-full sm:w-auto justify-center rounded-xl bg-transparent">
                <span>See how it works</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-fintech-dark py-24 border-t border-fintech-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-fintech-text mb-4">Everything you need to succeed</h2>
              <p className="text-fintech-textMuted max-w-2xl mx-auto">Powerful tools designed to give you complete visibility into your financial health.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card bg-fintech-darker border-fintech-border/50 hover:border-fintech-green/50 transition-colors">
                <div className="w-12 h-12 bg-fintech-green/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-fintech-green" />
                </div>
                <h3 className="text-xl font-bold text-fintech-text mb-3">Smart Analytics</h3>
                <p className="text-fintech-textMuted leading-relaxed">Visualize your spending patterns with beautiful charts and actionable insights.</p>
              </div>
              <div className="card bg-fintech-darker border-fintech-border/50 hover:border-fintech-green/50 transition-colors">
                <div className="w-12 h-12 bg-fintech-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-fintech-green" />
                </div>
                <h3 className="text-xl font-bold text-fintech-text mb-3">Lightning Fast</h3>
                <p className="text-fintech-textMuted leading-relaxed">Built with the modern MERN stack for incredible performance and responsiveness.</p>
              </div>
              <div className="card bg-fintech-darker border-fintech-border/50 hover:border-fintech-green/50 transition-colors">
                <div className="w-12 h-12 bg-fintech-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-fintech-green" />
                </div>
                <h3 className="text-xl font-bold text-fintech-text mb-3">Secure by Design</h3>
                <p className="text-fintech-textMuted leading-relaxed">Your data is encrypted and secure with industry-standard JWT authentication.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-fintech-darker py-8 border-t border-fintech-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-fintech-textMuted text-sm">
            © {new Date().getFullYear()} SmartFinance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
