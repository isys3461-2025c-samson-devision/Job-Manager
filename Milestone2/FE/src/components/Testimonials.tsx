import { testimonials } from "../constants";
export default function Testimonials() {
    return (
        <div className="mt-20 tracking-wide">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">What Our Users Say</h2>
            <div className=" flex flex-wrap justify-center" >
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="m-4 w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg">
                        <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                        <div className="flex items-center">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.user}
                                className="h-12 w-12 rounded-full mr-4"
                            />
                            <div>
                                <h4 className="text-lg font-semibold">{testimonial.user}</h4>
                                <p className="text-sm text-gray-500">{testimonial.position}{testimonial.company ? ` • ${testimonial.company}` : ""}</p>
                            </div>
                        </div>
                    </div>
                ))}
                

            </div>

        </div>
    );
}
