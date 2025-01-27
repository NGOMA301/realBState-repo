import React from 'react';
import { Star } from 'lucide-react';
import hirwa from '../Assets/hirwa11.png'
import greille from '../Assets/greille.png'

const TestimonialsPage = () => {
  const testimonials = [
    {
      id: 1,
      name: "Hirwa Jeremie",
      image: hirwa,
      text: "We have recently begun to act with Black Snake Realty last month. We are very satisfied with their services so far and amazed by their professional team.",
      rating: 3
    },
    {
      id: 2,
      name: "Abayo greille",
      image: greille,
      text: "I'm thrilled to see how effectively they handle every detail. The agency listens to our needs carefully and helps finding best solutions.",
      rating: 3
    },
    {
      id: 3,
      name: "Ron Bradley",
      image: hirwa,
      text: "Their professionalism and expertise made our searching process much easier. We were able to communicate very smoothly, everyone stayed helpful throughout the process.",
      rating: 5
    },
    {
      id: 4,
      name: "Joel Pearson",
      image: greille,
      text: "Great communication and very professional service. Will definitely recommend their service to anyone who wants to rent or buy property with the best guidance.",
      rating: 0
    }
  ];

  const Rating = ({ score }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${
            index < score
              ? 'fill-dark-400 text-dark-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Client Testimonials</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={testimonial.image}
              alt={`${testimonial.name}'s profile`}
              className="w-20 h-20 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {testimonial.name}
              </h3>
              
              
              
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {testimonial.text}
              </p>
              <Rating score={testimonial.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsPage;