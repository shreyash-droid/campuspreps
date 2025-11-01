"use client";

import { useState } from "react";
import Image from "next/image";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true, error: null });

    try {
      // Validate form data before submission
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error('All fields are required');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!responseText) {
          throw new Error('Empty response from server');
        }
        
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Server returned invalid response format');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Failed to send message');
      }

      // Success handling
      console.log('Message sent successfully:', data);
      setStatus({ submitted: true, submitting: false, error: null });
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);

    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        submitted: false,
        submitting: false,
        error: error.message || 'Failed to send message. Please try again.'
      });
    }
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
            <Image src="/vector-134.svg" alt="phone" width={24} height={24} />
            <span>+91 9876543210</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-medium">
            <Image src="/vector-13--stroke-.svg" alt="email" width={24} height={24} />
            <span>dummy@gmail.com</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-medium">
            <Image src="/vector-1.svg" alt="location" width={24} height={24} />
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
              <button 
                type="submit" 
                className="bg-black text-white py-3 px-6 rounded-md text-lg hover:bg-gray-800 disabled:bg-gray-500"
                disabled={status.submitting}
              >
                {status.submitting ? 'Sending...' : 'Send'}
              </button>
              {status.submitted && (
                <span className="text-green-600 font-medium">Thank you for your message! We&apos;ll get back to you soon.</span>
              )}
              {status.error && (
                <span className="text-red-600 font-medium">{status.error}</span>
              )}
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
