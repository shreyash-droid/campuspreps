"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="text-white mt-32 bg-gradient-to-bl from-[#00b3ff] to-[#06007d] flex flex-col items-center px-10 py-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center ">Contact</h2>

      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-16">
        {/* Contact Info */}
        <div className="flex flex-col gap-6 lg:max-w-xl">
          <h1 className="text-3xl font-semibold leading-snug">Have A Question? <br />Get In Touch!</h1>
          <p className="text-lg text-gray-300">
            Thank you for visiting my website! If you have any questions or queries, 
            drop a message, and I&apos;ll get back to you promptly. Your time is valuable!
          </p>
          <div className="flex items-center gap-4 text-lg font-medium">
            <img src="/vector-134.svg" alt="phone" className="w-6 h-6" />
            <span>+91 9876543210</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-medium">
            <img src="/vector-13--stroke-.svg" alt="email" className="w-6 h-6" />
            <span>dummy@gmail.com</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-medium">
            <img src="/vector-1.svg" alt="location" className="w-6 h-6" />
            <span>Bhopal</span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white text-black p-10 rounded-lg shadow-lg flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="flex-1 p-3 border-2 border-gray-700 rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 p-3 border-2 border-gray-700 rounded-md"
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-3 border-2 border-gray-700 rounded-md"
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="p-3 border-2 border-gray-700 rounded-md h-32 resize-none"
              required
            ></textarea>
            <div className="flex flex-col gap-2">
              <button type="submit" className="bg-black text-white py-3 px-6 rounded-md text-lg hover:bg-gray-800">Send</button>
              {submitted && <span className="text-green-600 font-medium">Thank you for your message!</span>}
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 flex flex-col md:flex-row justify-between w-full max-w-7xl text-white">
        <div>
          <h3 className="text-2xl font-bold mb-4">Quicklinks</h3>
          <ul className="space-y-2 text-lg">
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact me</a></li>
          </ul>
        </div>

        <div>
          <p className="text-lg">Connect. Learn. Grow.</p>
          <div className="flex gap-4 mt-4">
            {/* Add social icons or links here */}
            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </footer>
    </section>
  );
}
