"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, BookOpen, Youtube, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Reveal from "./Reveal";

const services = [
  {
    n: "01",
    title: "Previous Year Questions",
    icon: <FileText className="h-4 w-4" />,
    image: "/previous.png",
    blurb: "A comprehensive collection of past exam papers, organised by year and subject.",
  },
  {
    n: "02",
    title: "Study Materials",
    icon: <BookOpen className="h-4 w-4" />,
    image: "/study.png",
    blurb: "High-quality notes and resources curated by subject-matter experts.",
  },
  {
    n: "03",
    title: "Youtube Links",
    icon: <Youtube className="h-4 w-4" />,
    image: "/youtube.png",
    blurb: "Hand-picked educational videos to supplement your learning.",
  },
];

export default function Services() {
  const { user, isAuthenticated } = useAuth();
  const userName = user?.name?.split(" ")[0] || "";

  return (
    <div id="services" className="relative z-10 px-6 py-32 md:px-16">
      <Reveal className="mx-auto mb-16 max-w-2xl text-center">
        <span className="eyebrow">What we offer</span>
        <h2 className="display mt-4 text-4xl text-[var(--fg)] md:text-5xl">
          {isAuthenticated
            ? `What would you like to study today${userName ? `, ${userName}` : ""}?`
            : "Everything for your prep, in one place"}
        </h2>
      </Reveal>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={index * 120}>
            <Link href="/select-year" className="group block h-full">
              <article className="card-surface flex h-full flex-col overflow-hidden rounded-3xl">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/20 to-transparent" />
                  <span className="absolute right-4 top-4 display text-sm text-white/50">{service.n}</span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--accent)]">
                    {service.icon}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-medium text-[var(--fg)]">{service.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--fg-3)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">{service.blurb}</p>
                </div>
              </article>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
