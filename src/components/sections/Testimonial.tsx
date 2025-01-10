import React from "react";
import Image from "next/image";

function Testimonial() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-blue-900 text-3xl sm:text-4xl lg:text-5xl font-bold mb-12">
          What Our Users Say
        </h2>
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl">
            <Image
              src="/img/testimonial.png"
              alt="User testimonials"
              width={1200}
              height={628}
              className="rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent mix-blend-overlay rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;

