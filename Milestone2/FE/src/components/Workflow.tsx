import CV from '../assets/3CV.png';
// import {CheckCircle} from 'lucide-react';
 export default function Workflow() {
    return (
        <div className='mt-20'>
            <h2 className='text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide' >
               Streamline Your Job Search with Our
                <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">{' '}Workflow</span>
            </h2>
            <div className="flex flex-wrap justify-center">
                <div className="p-2 w-full lg:w-1/2">
                    <div className="rounded-2xl bg-white p-4 shadow-lg">
                        <img
                            src={CV}
                            alt="CV Workflow"
                            className="h-auto w-full rounded-xl brightness-110 contrast-110"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}