import React from "react";
import Image from "next/image";
// import { Check } from 'lucide-react';

function Features() {
  const featuresList = [
    { icon: "/img/vmeet.png", alt: "Virtual Meeting icon", text: "Virtual Meeting" },
    { icon: "/img/mail.png", alt: "Email and Calendar icon", text: "Email and Calendar" },
    { icon: "/img/chat.png", alt: "Team Chat icon", text: "Team Chat" },
    { icon: "/img/wboard.png", alt: "Online Whiteboard icon", text: "Online Whiteboard" },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/img/ftimg.png"
                alt="MeetHub features showcase"
                width={732}
                height={598}
                layout="responsive"
                className="transition-transform duration-300 ease-in-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent mix-blend-overlay" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="flex items-center text-blue-500 text-xl lg:text-2xl font-semibold gap-2">
              <Image src="/img/thumb.png" alt="" width={28} height={25} aria-hidden="true" />
              <h2>Features</h2>
            </div>

            <h3 className="text-3xl lg:text-4xl font-bold text-blue-900">
              Where Scheduling <br className="hidden lg:block" />
              Meets Versatility
            </h3>
            <p className="text-blue-700 text-lg lg:text-xl">
              Tools for seamless collaboration, efficient planning, and successful virtual engagements across diverse scenarios.
            </p>
            <ul className="space-y-6 lg:space-y-8">
              {featuresList.map((feature, index) => (
                <li key={index} className="flex items-center text-blue-700 text-lg lg:text-xl gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Image src={feature.icon} alt={feature.alt} width={32} height={32} />
                  </div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;








// import React from "react";
// import Image from "next/image";

// function Features() {
//   return (
//     <div className="container mx-auto my-10">
//       <div className="px-16 py-10">
//         <div className="flex justify-center gap-[45px]">
//           <Image
//             src="/img/ftimg.png"
//             alt="Hero"
//             width="732"
//             height="598"
//             className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700"
//           />
//           <div className="flex flex-col gap-8">
//             <div className="flex m-2 text-[#002267] text-[22px] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700">
//               <Image src="/img/thumb.png" alt="Hero" width="28" height="25" />
//               Features
//             </div>

//             <div className="text-4xl font-medium ">
//               <div className="text-[#002267]">
//                 {" "}
//                 Where Scheduling <br />
//                 Meets Versatility
//               </div>
//             </div>
//             <p className="text-[#002267] font-[22px]">
//               Tools for seamless collaboration, efficient <br /> planning, and
//               successful virtual engagements <br /> across diverse scenarios.
//             </p>
//             <div className="flex flex-col gap-8	">
//               <div className="flex text-[#002267] text-[22px] gap-[8px] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700">
//                 <Image src="/img/vmeet.png" alt="Hero" width="41" height="41" />
//                 Features Virtual Meeting
//               </div>
//               <div className="flex text-[#002267] text-[22px] gap-[8px] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700">
//                 <Image src="/img/mail.png" alt="Hero" width="41" height="41" />
//                 Email and Calendary
//               </div>
//               <div className="flex text-[#002267] text-[22px] gap-[8px] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700">
//                 <Image src="/img/chat.png" alt="Hero" width="41" height="41" />
//                 Team Chat
//               </div>
//               <div className="flex text-[#002267] text-[22px] gap-[8px] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700">
//                 <Image
//                   src="/img/wboard.png"
//                   alt="Hero"
//                   width="41"
//                   height="41"
//                 />
//                 Online Whiteboard
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Features;
