interface HeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function Header({ title, subtitle, breadcrumbs }: HeaderProps) {
    return (
        <div className="bg-gray-50 border-b border-gray-200 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex mb-4 text-sm text-gray-600">
                        {breadcrumbs.map((crumb, idx) => (
                            <span key={idx}>
                                {crumb.href ? (
                                    <a href={crumb.href} className="hover:text-blue-600">
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span>{crumb.label}</span>
                                )}
                                {idx < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                            </span>
                        ))}
                    </nav>
                )}

                {/* Title & Subtitle */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}