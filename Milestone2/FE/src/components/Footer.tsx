import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-white font-bold mb-4">JobApp</h3>
                        <p className="text-sm text-gray-400">
                            Find your next opportunity with JobApp.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="hover:text-white">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile/create" className="hover:text-white">
                                    Create Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <p className="text-sm text-gray-400">
                            Email: info@jobapp.com
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800"></div>

                {/* Copyright */}
                <div className="pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {currentYear} JobApp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}