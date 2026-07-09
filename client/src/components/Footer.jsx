const Footer = () => {
  return (
    <footer className="py-6 mt-12 border-t border-fintech-border bg-transparent text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-4 text-xs text-fintech-textMuted gap-2">
        <p>© {new Date().getFullYear()} SmartFinance. All rights reserved.</p>
        <p className="flex items-center space-x-1">
          <span>Security Guaranteed</span>
          <span className="w-1 h-1 rounded-full bg-fintech-green"></span>
          <span>Encrypted Session</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
