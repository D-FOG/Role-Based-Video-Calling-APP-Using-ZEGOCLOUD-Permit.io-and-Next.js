import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqData = [
  {
    question: "How do I invite participants to my meeting?",
    answer: "Once your meeting is scheduled, you will receive a unique meeting link or access code. Share this with your participants through email, messaging, or any other preferred communication channel."
  },
  {
    question: "Is there a limit to the number of participants in a meeting?",
    answer: "There are no restrictions on the number of participants in MeetHub meetings. You can host meetings with as many attendees as you need."
  },
  {
    question: "Can I record meetings with MeetHub?",
    answer: "Yes, MeetHub allows users to record meetings for future reference or sharing. You can easily start and stop recording during your meeting sessions."
  },
  {
    question: "What devices are compatible with MeetHub?",
    answer: "MeetHub is compatible with a wide range of devices including desktop computers, laptops, tablets, and smartphones. It works on major operating systems like Windows, macOS, iOS, and Android."
  },
  {
    question: "Is MeetHub secure?",
    answer: "Yes, MeetHub prioritizes the security and privacy of its users. We use end-to-end encryption for all meetings and implement strict data protection measures to ensure your conversations remain confidential."
  }
];

function Faq() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqData.map((item, index) => (
            <Accordion key={index} type="single" collapsible className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <AccordionItem value={`item-${index + 1}`} className="border border-blue-200">
                <AccordionTrigger className="text-blue-800 font-semibold px-6 py-4 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-blue-600 px-6 py-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;

