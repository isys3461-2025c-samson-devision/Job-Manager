import type { ReactNode } from "react";
import {
  BatteryCharging,
  BotMessageSquare,
  Fingerprint,
  GlobeLock,
  PlugZap,
  ShieldHalf,
} from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems: Array<{ label: string; href: string }> = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#workflow" },
  { label: "Plans", href: "#pricing" },
  { label: "Success Stories", href: "#testimonials" },
];

export const testimonials: Array<{
  avatar: string;
  user: string;
  company: string;
  position: string;
  image: string;
  text: string;
}> = [
  {
    avatar: user1,
    user: "Alex Nguyen",
    company: "Boston Tech Corp",
    position: "Software Engineer Candidate",
    image: user1,
    text: "The application tracker kept everything organized. I applied faster, followed up on time, and landed interviews within a week.",
  },
  {
    avatar: user2,
    user: "Minh Tran",
    company: "Shoppee Vietnam",
    position: "Business Analyst Candidate",
    image: user2,
    text: "The profile builder made it easy to showcase my experience. Recruiters started reaching out after I completed my profile.",
  },
  {
    avatar: user3,
    user: "Jordan Lee",
    company: "Innovatech Solutions",
    position: "Frontend Developer Candidate",
    image: user3,
    text: "I loved the one-click apply feature. It saved me so much time and ensured my info was consistent across all applications.",
  },
  {
    avatar: user4,
    user: "Thao Pham",
    company: "TheGioiDiDong.com Vietnam",
    position: "Human Resources Candidate",
    image: user4,
    text: "The resume tips and guided profile sections helped me translate my past experience into the new role I wanted.",
  },
  {
    avatar: user5,
    user: "Priya Patel",
    company: "Microsoft ",
    position: "UX Designer Candidate",
    image: user5,
    text: "One-click apply and clean job details made applying feel effortless. I could tailor applications quickly without losing track.",
  },
  {
    avatar: user6,
    user: "Chris Kim",
    company: "New Graduate",
    position: "New Graduate",
    image: user6,
    text: "I liked seeing each application's status (applied, interviewing, offer). It reduced anxiety and helped me plan my next steps.",
  },
];

export const features: Array<{
  icon: ReactNode;
  text: string;
  description: string;
}> = [
  {
    icon: <BotMessageSquare />,
    text: "Smart Job Search",
    description:
      "Find roles faster with keyword search, location filters, and clean job details that highlight requirements and benefits.",
  },
  {
    icon: <Fingerprint />,
    text: "One Profile, Many Applications",
    description:
      "Create your candidate profile once and reuse it across applications—update skills, education, and experience anytime.",
  },
  {
    icon: <ShieldHalf />,
    text: "Secure Authentication",
    description:
      "Your account and profile data are protected with modern authentication and validated inputs across the platform.",
  },
  {
    icon: <BatteryCharging />,
    text: "Application Tracking",
    description:
      "Track every application in one place—know what you applied to, when you applied, and what stage you're in.",
  },
  {
    icon: <PlugZap />,
    text: "Fast Apply Workflow",
    description:
      "Apply in minutes with a streamlined flow that reduces retyping and keeps your information consistent.",
  },
  {
    icon: <GlobeLock />,
    text: "Privacy Controls",
    description:
      "Control what you share in your public profile and keep sensitive details private while applying to jobs.",
  },
];

export const checklistItems: Array<{ title: string; description: string }> = [
  {
    title: "Create your profile",
    description:
      "Add education, experience, skills, and a short summary so employers can understand your fit quickly.",
  },
  {
    title: "Search & save jobs",
    description:
      "Use filters to narrow results and save roles you want to apply to later.",
  },
  {
    title: "Apply with confidence",
    description:
      "Submit applications with consistent information and review details before sending.",
  },
  {
    title: "Track application status",
    description:
      "Keep a clear timeline of where you are in the process—from applied to interview to offer.",
  },
];

export const pricingOptions: Array<{
  title: string;
  price: string;
  features: string[];
}> = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Create profile & resume summary",
      "Search and save jobs",
      "Apply to jobs",
      "Basic application tracking",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Everything in Starter",
      "Advanced filters",
      "Job alerts",
      "Priority support",
    ],
  },
  
];

export const resourcesLinks: Array<{ href: string; text: string }> = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Resume Tips" },
  { href: "#", text: "Interview Prep" },
  { href: "#", text: "Career Guides" },
  { href: "#", text: "Help Center" },
];

export const platformLinks: Array<{ href: string; text: string }> = [
  { href: "#", text: "Browse Jobs" },
  { href: "#", text: "Saved Jobs" },
  { href: "#", text: "Application Tracker" },
  { href: "#", text: "Profile" },
  { href: "#", text: "Account Settings" },
];

export const communityLinks: Array<{ href: string; text: string }> = [
  { href: "#", text: "Career Events" },
  { href: "#", text: "Webinars" },
  { href: "#", text: "Mentorship" },
  { href: "#", text: "Student Programs" },
  { href: "#", text: "Hiring Partners" },
];
