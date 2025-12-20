import { CheckCircle2 } from "lucide-react";
import { pricingOptions } from "../constants";

export default function Pricing() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center tracking-wide">
                Subscription
                <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">{' '}Plans</span>
            </h2>
            <p className="mt-4 text-center text-gray-600">
                Pick the plan that fits your job search.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {pricingOptions.map((option, index) => (
                    <div key={index} className="h-full">
                        <div className="h-full rounded-2xl border bg-white p-6 shadow-lg flex flex-col">
                            <h3 className="text-2xl font-semibold text-center">{option.title}
                                {option.title === "Pro" && (
                                    <span className="ml-2 inline-block rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
                                        Popular
                                    </span>
                                )}
                            </h3>
                            <p className="mt-4 text-center">
                                <span className="text-4xl font-bold">{option.price}</span>
                                <span className="text-gray-600">/month</span>
                            </p>

                            <ul className="mt-6 space-y-4 flex-grow">
                                {option.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500 mr-3" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="mt-8 bg-orange-500 text-white py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                                Subscrible
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}