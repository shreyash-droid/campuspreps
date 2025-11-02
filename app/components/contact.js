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
    error: null,
    testing: false,
    testResult: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const testEmailConfig = async () => {
    setStatus(prev => ({ ...prev, testing: true, testResult: null }));
    
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      
      console.log('Email test result:', data);
      
      setStatus(prev => ({
        ...prev,
        testing: false,
        testResult: data.success ? 'Email configuration is working!' : `Test failed: ${data.error}`
      }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, testResult: null }));
      }, 5000);
      
    } catch (error) {
      console.error('Email test error:', error);
      setStatus(prev => ({
        ...prev,
        testing: false,
        testResult: `Test failed: ${error.message}`
      }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, testResult: null }));
      }, 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true, error: null });

    try {
      // Validate form data before submission
      if (!formData.name?.trim() || !formData.email?.trim() || !formData.subject?.trim() || !formData.message?.trim()) {
        throw new Error('All fields are required');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Submitting form data:', { 
        name: formData.name, 
        email: formData.email, 
        subject: formData.subject,
        messageLength: formData.message.length 
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!responseText) {
          throw new Error('Empty response from server');
        }
        
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error(`Server returned invalid response format. Status: ${response.status}`);
      }

      if (!response.ok) {
        console.error('API request failed:', response.status, data);
        throw new Error(data.error || data.details || `Request failed with status ${response.status}`);
      }

      if (!data.success) {
        console.error('API returned success=false:', data);
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

      // Auto-clear error after 10 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, error: null }));
      }, 10000);
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
            
            <span>+91 9876543210</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-medium">
            
            <span>shreyash.khare2023@vitstudent.ac.in</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-medium">
            
            <span>abhigyan.sharma2023@vitstudent.ac.in</span>
          </div>
          <div className="flex items-center gap-4 text-lg font-medium">
            
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
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-black text-white py-3 px-6 rounded-md text-lg hover:bg-gray-800 disabled:bg-gray-500"
                  disabled={status.submitting}
                >
                  {status.submitting ? 'Sending...' : 'Send'}
                </button>
                
              </div>
              {status.submitted && (
                <span className="text-green-600 font-medium">Thank you for your message! We&apos;ll get back to you soon.</span>
              )}
              {status.error && (
                <span className="text-red-600 font-medium">{status.error}</span>
              )}
              {status.testResult && (
                <span className={`font-medium ${status.testResult.includes('working') ? 'text-green-600' : 'text-orange-600'}`}>
                  {status.testResult}
                </span>
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
