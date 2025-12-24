import shibaLogo from '../assets/shibaLogo.png';
import { Menu, X } from 'lucide-react';
import { navItems } from '../constants';
import { useState } from 'react';

export default function NavbarWelcome () {
    const [mobileDrawerOpen, setMobileDrawerOpen] =  useState(false);
    const toggleMobileDrawer = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    }
    return (
        <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 py-3 backdrop-blur-lg">
            <div className="container mx-auto max-w-7xl px-4 text-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img className="h-20 w-20" src={shibaLogo} alt="Logo" />
                        <span className="text-xl font-semibold tracking-tight text-neutral-900">Shiba Job Tracker</span>
                    </div>

                    <ul className="hidden lg:flex items-center gap-10">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="text-neutral-700 transition-colors hover:text-neutral-900"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="#"
                            className="rounded-md border border-neutral-300 px-4 py-2 text-neutral-800 transition-colors hover:bg-neutral-50"
                        >
                            Login
                        </a>
                        <a
                            href="#"
                            className="rounded-md bg-gradient-to-r from-orange-500 to-orange-800 px-4 py-2 font-medium text-white transition-opacity hover:opacity-95"
                        >
                            Create an Account
                        </a>
                    </div>

                    <div className="flex justify-end lg:hidden">
                        <button
                            type="button"
                            onClick={toggleMobileDrawer}
                            className="inline-flex items-center justify-center rounded-md border border-neutral-300 p-2 text-neutral-800 hover:bg-neutral-50"
                            aria-label="Toggle menu"
                        >
                            {mobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                {mobileDrawerOpen && (

                    <div className="fixed inset-x-0 top-[57px] z-20 w-full border-b border-neutral-200 bg-white/95 p-8 backdrop-blur lg:hidden">
                        <ul className="space-y-6 text-center">
                            {navItems.map((item, index) => (
                                <li key={index} className="py-1">
                                    <a
                                        href={item.href}
                                        className="text-base font-medium text-neutral-800 transition-colors hover:text-neutral-900"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex justify-center gap-4">
                            <a
                                href="#"
                                className="rounded-md border border-neutral-300 px-4 py-2 text-neutral-800 transition-colors hover:bg-neutral-50"
                            >
                                Login
                            </a>
                            <a
                                href="#"
                                className="rounded-md bg-gradient-to-r from-orange-500 to-orange-800 px-4 py-2 font-medium text-white transition-opacity hover:opacity-95"
                            >
                                Create an Account
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}