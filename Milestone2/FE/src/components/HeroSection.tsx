import video1 from '../assets/video1.mp4';
import video2 from '../assets/video2.mp4';

export default function HeroSection() {
    return (
        <div className="flex flex-col items-center mt-6 lg:mt-20">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
                Empower Your Job Search with  
                <span className="bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent bg-clip-text">{' '}AI-Driven Precision
                </span>
            </h1>
            <p className="mt-10 text-lg text-center text-neatral-900 max-w-4xl ">
                Find your perfect job match with our AI-powered platform that tailors opportunities to your unique skills and aspirations.
            </p>
            <div className="flex justify-center my-10">
                <a href="#" className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 mx-3 rounded-md ">
                    <span className="text-white font-medium">Start for free </span>
                </a>
                <a href="#" className="py-3 px-4 rounded-md border ">
                    <span className="text-gray-900 font-medium">Learn more </span>
                </a>
            </div>
            <div className="flex mt-10 justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    <div className="rounded-lg overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/75 transition-shadow duration-300">
                        <video autoPlay loop muted className="w-full h-full object-cover">
                            <source src={video1} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="rounded-lg overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/75 transition-shadow duration-300">
                        <video autoPlay loop muted className="w-full h-full object-cover">
                            <source src={video2} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

            </div>
        </div>
    );
}