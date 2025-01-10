import React from "react";
import Image from "next/image";

function How() {
  const steps = [
    {
      image: "/img/how-1.png",
      title: "Create Your Account",
      description: "Sign up and set up your profile in just a few clicks.",
    },
    {
      image: "/img/how-2.png",
      title: "Schedule a Meeting",
      description: "Choose a time and invite your team members effortlessly.",
    },
    {
      image: "/img/how-3.png",
      title: "Collaborate Seamlessly",
      description: "Join the meeting and enjoy smooth, interactive collaboration.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-blue-900 text-3xl sm:text-4xl lg:text-5xl font-bold mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={step.image}
                  alt={`Step ${index + 1}: ${step.title}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-blue-900 text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-blue-600">{step.description}</p>
              </div>
              <div className="mt-auto pb-6">
                <span className="inline-block bg-blue-500 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default How;





// import React from "react";
// import Image from "next/image";

// function How() {
//   return (
//     <div className="container mx-auto my-10">
//       <div className="px-16 py-10">
//         <div className=" flex justify-center text-[#002267] text-[44px] font-[44px]">
//           How It Works
//         </div>
//         <div className=" grid grid-cols-3 gap-4 ">
//           <Image src="/img/how-1.png" alt="Logo" width="397" height="300" className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700"/>
//           <Image src="/img/how-2.png" alt="Logo" width="397" height="300" className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700"/>
//           <Image src="/img/how-3.png" alt="Logo" width="397" height="300" className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700"/>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default How;
