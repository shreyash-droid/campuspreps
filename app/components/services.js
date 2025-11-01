"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FileText, BookOpen, Youtube } from "lucide-react";

const services = [
  {
    title: "Previous Year Questions",
    icon: <FileText className="w-6 h-6" />,
    image: "/previous.png",
  },
  {
    title: "Study Materials",
    icon: <BookOpen className="w-6 h-6" />,
    image: "/study.png",
  },
  {
    title: "Youtube Links",
    icon: <Youtube className="w-6 h-6" />,
    image: "/youtube.png",
  },
];

export default function Services() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(userData.name?.split(' ')[0] || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Add mouse move effect for the glow
  const handleMouseMove = (e) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div id="services" className="py-50 px-4 md:px-16 text-black bg-none">
      <h1 className="text-4xl font-bold text-center mb-12 text-white">
        {isLoggedIn 
          ? `What would you like to study today${userName ? `, ${userName}` : ''}?` 
          : 'Our Services'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
        {services.map((service, index) => (
          <Link href="/select-year" key={index} className="w-full max-w-xs">
            <div 
              className="bg-white rounded-2xl p-6 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative"
              onMouseMove={handleMouseMove}
            >
              <div className="relative h-40 rounded-2xl mb-5 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-primary-600">{service.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.title === "Previous Year Questions" &&
                    "Access a comprehensive collection of past exam papers to enhance your preparation."}
                  {service.title === "Study Materials" &&
                    "High-quality study resources and notes curated by subject matter experts."}
                  {service.title === "Youtube Links" &&
                    "Curated educational videos to supplement your learning journey."}
                </p>
              </div>
              <div
                className="absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
