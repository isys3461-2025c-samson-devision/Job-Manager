
import CV from '../assets/3CV.png';
import { checklistItems } from '../constants';
import {CheckCircle} from 'lucide-react';
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

                <div className="p-2 w-full lg:w-1/2">
                    <div className='pt-12'>
                        {checklistItems.map((item, index) => (
                            <div key={index} className="mb-4 flex items-start">
                                {/* <CheckCircle className="mt-1 mr-2 h-6 w-6 flex-shrink-0 text-green-500" /> */}
                                <div className='text-green-400 mx-6 bg-neatral-200 h-10 w-10 p-2 justify-center items-center rounded-full'>
                                    <CheckCircle className="h-6 w-6 flex-shrink-0 " />
                          
                                </div>
                                <div>
                                   <h5 className='mt-1 mb-2 text-xl'>{item.title}</h5>
                                <p className="text-md text-gray-600">{item.description}</p> 
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}