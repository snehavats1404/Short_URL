// Enhanced Footer with dark theme
const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-green-500">URL Shortener</h3>
            <p className="text-sm text-gray-400 mt-1">
              Create shorter, trackable links in seconds
            </p>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} URL Shortener. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;