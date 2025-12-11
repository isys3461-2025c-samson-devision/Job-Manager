import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { logout } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token, user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="text-2xl font-bold">
                        JobApp
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {token && user ? (
                            <>
                                <Link to="/dashboard" className="hover:text-blue-200">
                                    Dashboard
                                </Link>
                                <Link to="/profile/create" className="hover:text-blue-200">
                                    Profile
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{user.email}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-blue-200">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}