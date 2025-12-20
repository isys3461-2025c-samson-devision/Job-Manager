import CompanyLogo1 from "../assets/CompanyLogo1.png";
import CompanyLogo2 from "../assets/CompanyLogo2.png";
import CompanyLogo3 from "../assets/CompanyLogo3.png";
import CompanyLogo4 from "../assets/CompanyLogo4.png";
import CompanyLogo5 from "../assets/CompanyLogo5.png";
import CompanyLogo6 from "../assets/CompanyLogo6.png";

export default function Company() {
    const logos = [
        { src: CompanyLogo1, alt: "Company 1" },
        { src: CompanyLogo2, alt: "Company 2" },
        { src: CompanyLogo3, alt: "Company 3" },
        { src: CompanyLogo4, alt: "Company 4" },
        { src: CompanyLogo5, alt: "Company 5" },
        { src: CompanyLogo6, alt: "Company 6" },
    ];

    return (
        <div className="mt-20 mb-10">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">Trusted by Leading Companies</h2>

            <div className="company-marquee">
                <div className="company-marquee-track py-6">
                    {[...logos, ...logos].map((logo, index) => (
                        <div key={index} className="mx-10 flex items-center flex-shrink-0">
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
}