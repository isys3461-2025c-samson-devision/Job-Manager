import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

export default function NavBar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { token, user } = useAppSelector((state) => state.auth);

    const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const urlQuery = urlSearch.get('q') ?? '';
    const [query, setQuery] = useState(urlQuery);

    useEffect(() => {
        setQuery(urlQuery);
    }, [urlQuery]);

    const handleLogout = () => {
        // Clear any locally stored identifiers
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        dispatch(logout());
        navigate('/login');
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const next = new URLSearchParams(location.search);
        const trimmed = query.trim();
        if (!trimmed) next.delete('q');
        else next.set('q', trimmed);

        navigate({ pathname: location.pathname, search: next.toString() ? `?${next.toString()}` : '' });
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="text-2xl font-bold">
                        JobApplicant
                    </Link>

                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            type="search"
                            placeholder="Search"
                            className="w-full px-3 py-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/60"
                        />
                        <button
                            type="submit"
                            className="px-3 py-2 rounded bg-white/20 hover:bg-white/30 text-white font-semibold"
                        >
                            Search
                        </button>
                    </form>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {token && user ? (
                            <>
                                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 hover:text-blue-200">
                                        <span className="text-sm">{user.email}</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Logout</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-blue-200">Login</Link>
                                <Link to="/register" className="hover:text-blue-200">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}