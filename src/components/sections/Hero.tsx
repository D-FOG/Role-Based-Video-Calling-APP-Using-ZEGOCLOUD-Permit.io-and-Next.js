import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import { Button } from "../../components/ui/button";

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:gap-8 max-w-lg lg:max-w-xl">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              <span className="text-blue-500 block mb-2">Seamless</span>
              <span className="text-blue-900">
                Meeting <br />
                Collaboration <br />
                for Teams
              </span>
            </h1>
            <p className="text-blue-700 text-lg lg:text-xl">
              Join thousands of satisfied users. Experience the future of team meetings with MeetHub today!
            </p>
            <Link href="/meeting">
              <Button size="lg" className="group bg-blue-500 hover:bg-blue-600 text-white">
                Schedule your first Meeting
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
          <div className="flex-shrink-0 w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="relative">
              <Image
                src="/img/heroimage.png"
                alt="Team collaborating in a virtual meeting"
                width={732}
                height={598}
                className="rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-blue-500/20 to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;










// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

// function Hero() {
//   return (
//     <div className="container mx-auto my-10">
//       <div className="px-16 py-10">
//         <div className="flex justify-between items-center">
//           <div className="flex flex-col gap-10">
//             <div className="text-6xl font-medium ">
//               <div className="text-[#5D5DFF]">Seamless</div>
//               <div className="text-[#002267]">
//                 {" "}
//                 Meeting <br />
//                 Collaboration <br />
//                 for Teams
//               </div>
//             </div>
//             <p className="text-[#002267] font-[22px]">
//               Join thousands of satisfied users. Try MeetHub today!
//             </p>
//             <Link href="/meeting">
//             <button className="btn p-2 bg-[#38ACFF] text-white rounded-full border-none h-10">
//               Schedule your first Meeting
//             </button>
//             </Link>
//           </div>
//           <Image src="/img/heroimage.png" alt="Hero" width="732" height="598" className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 ration-700" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Hero;
