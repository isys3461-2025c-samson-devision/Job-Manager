import { features } from "../constants";
export default function FeatureSection() {
    return (
        <div className=" relative mt-20 border-b border-netural-800 min-h-[800px] " >
            <div className="text-center">
                <span className="bg-netural-900 text-orange-500 rounded-full h-6 text-sm font-medium px-2 uppercase  ">
                    Features
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking wide ">Easily Manage Your    
                    <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">{' '}Job Applications</span>
            
                </h2>
             
            </div>
            <div className="flex flex-wrap mt-10 lg:mt-20 ">
                {features.map((feature, index) => (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-6 ">
                        <div className="bg-white rounded-lg shadow-lg p-6 h-full hover:shadow-xl transition-shadow duration-300">
                            <div className="text-orange-500 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="mt-1 mb-6 text-xl font-semibold">{feature.text}</h3>
                            <p className="text-gray-700">{feature.description}</p>
                        </div>
                    </div>
                ))}

            </div>
            
        </div>
    );
}
