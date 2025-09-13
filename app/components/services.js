import Link from "next/link";
import Image from "next/image"; // ✅ Add this line
import { FileText, BookOpen, Youtube } from "lucide-react";

const services = [
  {
    title: "Previous Year Questions",
    icon: <FileText className="w-8 h-8" />,
    image: "/previous.png",
  },
  {
    title: "Study Materials",
    icon: <BookOpen className="w-8 h-8" />,
    image: "/study.png",
  },
  {
    title: "Youtube Links",
    icon: <Youtube className="w-8 h-8" />,
    image: "/youtube.png",
  },
];

export default function Services() {
  return (
    <div id="services" className="py-40 px-4 md:px-16 text-white bg-none">
      <h1 className="text-4xl font-bold text-center mb-10">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {services.map((service, index) => (
          <Link href="/select-year" key={index} className="w-full max-w-xs">
            <div className="bg-gradient-to-br from-[#898989] via-[#121212] to-[#494949] rounded-2xl p-4 pb-5 w-full shadow-md hover:scale-110 transition duration-300 cursor-pointer">
              <div className="relative h-32 rounded-md mb-4 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                {service.icon}
                <span className="p-2 text-lg">{service.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
