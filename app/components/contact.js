"use client";

import { useState } from "react";

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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true, error: null });

    try {
      if (!formData.name?.trim() || !formData.email?.trim() || !formData.subject?.trim() || !formData.message?.trim()) {
        throw new Error("All fields are required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      const responseText = await response.text();
      if (!responseText) throw new Error("Empty response from server");
      const data = JSON.parse(responseText);

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || "Failed to send message");
      }

      setStatus({ submitted: true, submitting: false, error: null });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus((prev) => ({ ...prev, submitted: false })), 5000);
    } catch (error) {
      setStatus({ submitted: false, submitting: false, error: error.message || "Failed to send message. Please try again." });
      setTimeout(() => setStatus((prev) => ({ ...prev, error: null })), 10000);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--line)] bg-white/[0.03] p-3.5 text-[var(--fg)] placeholder:text-[var(--fg-3)] outline-none transition focus:border-[var(--accent)]/70 focus:bg-white/[0.05]";

  return (
    <section id="contact" className="relative z-10 border-t border-[var(--line)] bg-[var(--ink-2)]/50 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-16 lg:flex-row">
          {/* Info */}
          <div className="flex flex-col gap-6 lg:max-w-md">
            <span className="eyebrow">Get in touch</span>
            <h2 className="display text-4xl text-[var(--fg)] md:text-5xl">
              Have a question?
              <br />
              <em className="display-italic text-[var(--accent)]">Let&apos;s talk.</em>
            </h2>
            <p className="text-lg leading-relaxed text-[var(--fg-2)]">
              If you have any questions or queries, drop a message and we&apos;ll get back to you
              promptly. Your time is valuable.
            </p>
            <div className="mt-2 space-y-3 text-[var(--fg-2)]">
              <p>+91 9876543210</p>
              <p>shreyash.khare2023@vitstudent.ac.in</p>
              <p>abhigyan.sharma2023@vitstudent.ac.in</p>
              <p>Bhopal, India</p>
            </div>
          </div>

          {/* Form */}
          <div className="card-surface flex-1 rounded-3xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} className={inputClass} required />
                <input type="email" name="email" placeholder="Your email" value={formData.email} onChange={handleChange} className={inputClass} required />
              </div>
              <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className={inputClass} required />
              <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} className={`${inputClass} h-36 resize-none`} required />

              <button
                type="submit"
                disabled={status.submitting}
                className="btn-primary focus-ring mt-1 rounded-full py-3.5 text-base font-medium disabled:opacity-60"
              >
                {status.submitting ? "Sending…" : "Send message"}
              </button>

              {status.submitted && (
                <span className="text-sm text-[var(--accent)]">Thank you — we&apos;ll get back to you soon.</span>
              )}
              {status.error && <span className="text-sm text-[#d98c74]">{status.error}</span>}
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 flex flex-col justify-between gap-8 border-t border-[var(--line)] pt-10 text-[var(--fg-2)] md:flex-row">
          <div>
            <div className="display mb-3 text-lg text-[var(--fg)]">Campus Preps</div>
            <p className="text-sm">Connect. Learn. Grow.</p>
          </div>
          <div className="flex gap-10 text-sm">
            <a href="#services" className="transition hover:text-[var(--fg)]">Services</a>
            <a href="#contact" className="transition hover:text-[var(--fg)]">Contact</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
