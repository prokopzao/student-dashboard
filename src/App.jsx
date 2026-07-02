/**
 * Student Stress & Well-being Dashboard
 * ---------------------------------------------------------------------------
 * IMPORTANT — Tailwind v4 setup:
 * Tailwind v4 uses CSS-first configuration. By default, the `dark:` variant
 * follows the OS `prefers-color-scheme`, not a class on an ancestor element.
 * For the in-app toggle below to control dark mode (instead of the OS
 * setting), add this line to your global CSS entry file (e.g. src/index.css),
 * directly below `@import "tailwindcss";`:
 *
 *   @custom-variant dark (&:where(.dark, .dark *));
 *
 * This tells Tailwind to key `dark:` off the `.dark` class applied to the
 * top-level wrapper below, which is exactly what `isDarkMode` toggles.
 * ---------------------------------------------------------------------------
 */

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  CheckCircle2,
  ArrowUpCircle,
  AlertTriangle,
  Calendar,
  MessageCircle,
  Target,
  Users,
  Clock,
  ArrowRight,
  Sun,
  Moon,
  Printer,
  Bot,
  X,
} from "lucide-react";

/* ========================================================================
   MOCK STUDENT DATABASE
   Each entry drives every card, chart, table, and AI-text block in the
   dashboard. Swapping `selectedId` swaps the entire view.
   ======================================================================== */

const STUDENTS = {
  john: {
    id: "john",
    name: "John Smith",
    studentId: "20231245",
    programme: "Business Administration",
    semester: "Spring 2026, Week 8",
    lastUpdate: "12 May 2026, 10:30 AM",
    metrics: {
      stressScore: { value: "3.2", unit: "/ 5", status: "Moderate Risk", tone: "orange" },
      freeTime: { value: "1.4", unit: "/ 5", status: "High Risk", tone: "red" },
      careerPressure: { value: "4.5", unit: "/ 5", status: "High Risk", tone: "red" },
      combinedRisk: { value: "HIGH", status: "Career Pressure × Lack of Free Time", tone: "red" },
    },
    lineData: [
      { week: "W1", student: 1.8, teacher: 1.6, cohort: 1.7 },
      { week: "W2", student: 2.0, teacher: 1.8, cohort: 1.8 },
      { week: "W3", student: 2.2, teacher: 2.0, cohort: 1.9 },
      { week: "W4", student: 2.5, teacher: 2.2, cohort: 2.0 },
      { week: "W5", student: 2.3, teacher: 2.1, cohort: 2.0 },
      { week: "W6", student: 2.6, teacher: 2.3, cohort: 2.1 },
      { week: "W7", student: 2.9, teacher: 2.5, cohort: 2.2 },
      { week: "W8", student: 3.2, teacher: 2.8, cohort: 2.4 },
      { week: "W9", student: 3.3, teacher: 2.9, cohort: 2.5 },
      { week: "W10", student: 3.0, teacher: 2.7, cohort: 2.4 },
      { week: "W11", student: 3.1, teacher: 2.8, cohort: 2.5 },
      { week: "W12", student: 3.4, teacher: 3.0, cohort: 2.6 },
      { week: "W13", student: 3.6, teacher: 3.2, cohort: 2.7 },
      { week: "W14", student: 3.8, teacher: 3.4, cohort: 2.9 },
    ],
    radarData: [
      { dimension: "Stress Mgmt.", self: 2.2, teacher: 2.6 },
      { dimension: "Work-Life Balance", self: 1.8, teacher: 2.2 },
      { dimension: "Academic Confidence", self: 3.8, teacher: 3.5 },
      { dimension: "Career Anxiety", self: 4.6, teacher: 4.0 },
      { dimension: "Emotional Well-being", self: 2.6, teacher: 2.9 },
      { dimension: "Coping Strategies", self: 2.4, teacher: 2.8 },
    ],
    stressFactors: [
      { factor: "Time Pressure", self: 4.0, teacher: 3.8, status: "orange" },
      { factor: "Exams", self: 3.5, teacher: 3.2, status: "orange" },
      { factor: "Study Difficulty", self: 2.8, teacher: 2.6, status: "green" },
      { factor: "Career Pressure", self: 4.8, teacher: 4.2, status: "red" },
      { factor: "Free Time Availability", self: 1.2, teacher: "–", status: "red" },
    ],
    insights: [
      { icon: "check", tone: "green", label: "Strength", text: "Healthy academic confidence" },
      { icon: "up", tone: "orange", label: "Area for Improvement", text: "Time management and recovery" },
      { icon: "alert", tone: "red", label: "Priority Risk", text: "Career anxiety combined with insufficient recovery time" },
    ],
    recommendationIntro:
      "Your current stress profile indicates elevated career-related concerns combined with low levels of free time. Research findings suggest this combination represents the strongest risk factor for increased perceived stress.",
    recommendations: [
      { title: "Schedule protected free time", desc: "Plan at least 2 blocks for recovery this week." },
      { title: "Reduce overlapping commitments", desc: "Prioritise tasks and avoid overcommitment." },
      { title: "Meet with a mentor", desc: "Discuss career concerns and receive guidance." },
      { title: "Prioritise upcoming deadlines", desc: "Focus on key tasks for the next 2 weeks." },
    ],
  },

  emma: {
    id: "emma",
    name: "Emma Davis",
    studentId: "20238841",
    programme: "Psychology",
    semester: "Spring 2026, Week 8",
    lastUpdate: "12 May 2026, 10:30 AM",
    metrics: {
      stressScore: { value: "1.9", unit: "/ 5", status: "Low Risk", tone: "green" },
      freeTime: { value: "4.3", unit: "/ 5", status: "Low Risk", tone: "green" },
      careerPressure: { value: "1.7", unit: "/ 5", status: "Low Risk", tone: "green" },
      combinedRisk: { value: "LOW", status: "Balanced workload and recovery time", tone: "green" },
    },
    lineData: [
      { week: "W1", student: 1.6, teacher: 1.5, cohort: 1.7 },
      { week: "W2", student: 1.7, teacher: 1.6, cohort: 1.8 },
      { week: "W3", student: 1.6, teacher: 1.5, cohort: 1.8 },
      { week: "W4", student: 1.8, teacher: 1.7, cohort: 1.9 },
      { week: "W5", student: 1.7, teacher: 1.6, cohort: 1.9 },
      { week: "W6", student: 1.9, teacher: 1.8, cohort: 2.0 },
      { week: "W7", student: 2.0, teacher: 1.8, cohort: 2.1 },
      { week: "W8", student: 1.9, teacher: 1.8, cohort: 2.2 },
      { week: "W9", student: 2.0, teacher: 1.9, cohort: 2.3 },
      { week: "W10", student: 1.8, teacher: 1.7, cohort: 2.2 },
      { week: "W11", student: 1.9, teacher: 1.8, cohort: 2.3 },
      { week: "W12", student: 2.1, teacher: 2.0, cohort: 2.4 },
      { week: "W13", student: 2.2, teacher: 2.0, cohort: 2.5 },
      { week: "W14", student: 2.3, teacher: 2.1, cohort: 2.6 },
    ],
    radarData: [
      { dimension: "Stress Mgmt.", self: 4.0, teacher: 3.8 },
      { dimension: "Work-Life Balance", self: 4.3, teacher: 4.0 },
      { dimension: "Academic Confidence", self: 4.1, teacher: 4.0 },
      { dimension: "Career Anxiety", self: 1.5, teacher: 1.7 },
      { dimension: "Emotional Well-being", self: 4.0, teacher: 3.9 },
      { dimension: "Coping Strategies", self: 4.2, teacher: 4.0 },
    ],
    stressFactors: [
      { factor: "Time Pressure", self: 1.8, teacher: 1.6, status: "green" },
      { factor: "Exams", self: 2.2, teacher: 2.0, status: "green" },
      { factor: "Study Difficulty", self: 1.6, teacher: 1.5, status: "green" },
      { factor: "Career Pressure", self: 1.7, teacher: 1.5, status: "green" },
      { factor: "Free Time Availability", self: 4.3, teacher: "–", status: "green" },
    ],
    insights: [
      { icon: "check", tone: "green", label: "Strength", text: "Consistently strong time-management and recovery habits" },
      { icon: "up", tone: "green", label: "Area for Improvement", text: "Could engage earlier with long-term career planning" },
      { icon: "check", tone: "green", label: "Status", text: "No significant risk factors identified this period" },
    ],
    recommendationIntro:
      "Your current stress profile reflects a well-balanced academic and personal routine. Research suggests maintaining this balance is the strongest protective factor against rising stress as the semester progresses.",
    recommendations: [
      { title: "Maintain current routine", desc: "Continue current study and recovery patterns." },
      { title: "Explore career resources", desc: "Use available time to explore internships and career planning." },
      { title: "Stay connected with peers", desc: "Continue peer engagement to reinforce support networks." },
      { title: "Monitor pre-finals workload", desc: "Reassess workload as Week 12–14 deadlines approach." },
    ],
  },

  alex: {
    id: "alex",
    name: "Alex Chen",
    studentId: "20234567",
    programme: "Computer Science",
    semester: "Spring 2026, Week 8",
    lastUpdate: "12 May 2026, 10:30 AM",
    metrics: {
      stressScore: { value: "3.0", unit: "/ 5", status: "Moderate Risk", tone: "orange" },
      freeTime: { value: "2.6", unit: "/ 5", status: "Moderate Risk", tone: "orange" },
      careerPressure: { value: "2.8", unit: "/ 5", status: "Moderate Risk", tone: "orange" },
      combinedRisk: { value: "MODERATE", status: "Study Difficulty × Time Pressure", tone: "orange" },
    },
    lineData: [
      { week: "W1", student: 2.3, teacher: 2.1, cohort: 2.0 },
      { week: "W2", student: 2.4, teacher: 2.2, cohort: 2.0 },
      { week: "W3", student: 2.6, teacher: 2.4, cohort: 2.1 },
      { week: "W4", student: 2.8, teacher: 2.6, cohort: 2.2 },
      { week: "W5", student: 2.6, teacher: 2.4, cohort: 2.1 },
      { week: "W6", student: 2.9, teacher: 2.6, cohort: 2.2 },
      { week: "W7", student: 3.1, teacher: 2.8, cohort: 2.3 },
      { week: "W8", student: 3.0, teacher: 2.8, cohort: 2.4 },
      { week: "W9", student: 3.1, teacher: 2.9, cohort: 2.4 },
      { week: "W10", student: 2.8, teacher: 2.6, cohort: 2.3 },
      { week: "W11", student: 2.9, teacher: 2.7, cohort: 2.4 },
      { week: "W12", student: 3.2, teacher: 3.0, cohort: 2.5 },
      { week: "W13", student: 3.3, teacher: 3.0, cohort: 2.6 },
      { week: "W14", student: 3.4, teacher: 3.1, cohort: 2.7 },
    ],
    radarData: [
      { dimension: "Stress Mgmt.", self: 2.8, teacher: 3.0 },
      { dimension: "Work-Life Balance", self: 2.6, teacher: 2.8 },
      { dimension: "Academic Confidence", self: 2.3, teacher: 2.6 },
      { dimension: "Career Anxiety", self: 3.0, teacher: 2.7 },
      { dimension: "Emotional Well-being", self: 2.7, teacher: 2.9 },
      { dimension: "Coping Strategies", self: 2.9, teacher: 3.0 },
    ],
    stressFactors: [
      { factor: "Time Pressure", self: 3.2, teacher: 3.0, status: "orange" },
      { factor: "Exams", self: 3.0, teacher: 2.8, status: "orange" },
      { factor: "Study Difficulty", self: 4.3, teacher: 4.0, status: "red" },
      { factor: "Career Pressure", self: 2.6, teacher: 2.4, status: "orange" },
      { factor: "Free Time Availability", self: 2.6, teacher: "–", status: "orange" },
    ],
    insights: [
      { icon: "check", tone: "green", label: "Strength", text: "Consistent class attendance and peer collaboration" },
      { icon: "up", tone: "orange", label: "Area for Improvement", text: "Core study techniques and course comprehension" },
      { icon: "alert", tone: "orange", label: "Priority Risk", text: "Persistent difficulty with course material is affecting academic confidence" },
    ],
    recommendationIntro:
      "Your current stress profile indicates elevated difficulty with course material combined with moderate time pressure. Research findings suggest early academic support meaningfully reduces this type of stress before it compounds.",
    recommendations: [
      { title: "Book a study skills session", desc: "Work with an academic advisor on techniques for difficult material." },
      { title: "Form or join a study group", desc: "Peer study groups improve comprehension and reduce isolation." },
      { title: "Break down upcoming assignments", desc: "Split large assignments into smaller weekly milestones." },
      { title: "Reassess weekly time pressure", desc: "Protect at least one recovery block alongside study time." },
    ],
  },
};

const supportServices = [
  { service: "Academic Advisor", availability: "Available", tone: "green", next: "This week" },
  { service: "Psychological Counselling", availability: "Available", tone: "green", next: "Today" },
  { service: "Career Coach", availability: "Limited", tone: "orange", next: "2 days" },
  { service: "Peer Mentor", availability: "Available", tone: "green", next: "This week" },
];

const actions = [
  { key: "book", icon: Calendar, title: "Book Academic Consultation", desc: "Discuss workload, deadlines and study planning", cta: "Book Now" },
  { key: "contact", icon: MessageCircle, title: "Contact University Psychologist", desc: "Support for anxiety, stress and emotional well-being", cta: "Contact" },
  { key: "request", icon: Target, title: "Request Coaching Session", desc: "Goal setting, motivation and performance", cta: "Request" },
  { key: "connect", icon: Users, title: "Connect with Peer Mentor", desc: "Talk with a senior student who has similar experience", cta: "Connect" },
];

const MODAL_TITLES = {
  book: "Book Academic Consultation",
  contact: "Contact University Psychologist",
  request: "Request Coaching Session",
  connect: "Connect with Peer Mentor",
};

const SLOTS = ["Wed, 2:00 PM", "Thu, 10:00 AM", "Fri, 1:00 PM"];

const CHAT_MESSAGES = [
  { role: "user", text: "Hi, I'm feeling overwhelmed with my deadlines this week. Can you help me plan?" },
  { role: "ai", text: "Of course. Let's break your week into focused blocks so it feels more manageable." },
  { role: "ai", text: "Mon–Tue: two 2-hour blocks on your Strategy assignment. Wed: focused study for Thursday's exam. Thu: submit the assignment, light review only. Fri: protected free time, no work." },
  { role: "user", text: "That's really helpful, thank you." },
  { role: "ai", text: "Anytime. I'll check in on Friday to see how the week went." },
];

/* ========================================================================
   TONE TOKENS
   Centralised color mappings so every component reads risk level from one
   source of truth. Each includes light, dark, and dark+print overrides.
   ======================================================================== */

const dotTone = {
  green: "bg-emerald-500",
  orange: "bg-amber-500",
  red: "bg-rose-500",
};

const badgeTone = {
  green: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-900 dark:print:text-emerald-700 dark:print:bg-emerald-50 dark:print:border-emerald-200",
  orange: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-900 dark:print:text-amber-700 dark:print:bg-amber-50 dark:print:border-amber-200",
  red: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950 dark:border-rose-900 dark:print:text-rose-700 dark:print:bg-rose-50 dark:print:border-rose-200",
};

const toneText = {
  green: "text-emerald-600 dark:text-emerald-400 dark:print:text-emerald-600",
  orange: "text-amber-600 dark:text-amber-400 dark:print:text-amber-600",
  red: "text-rose-600 dark:text-rose-400 dark:print:text-rose-600",
};

// Used only for the elevated "priority" callout in the insights panel —
// a stronger left-border + tint treatment so it reads as an active alert,
// not just another list row.
const calloutTone = {
  green: "bg-emerald-50 border-emerald-500 dark:bg-emerald-950 dark:border-emerald-500 dark:print:bg-emerald-50 dark:print:border-emerald-500",
  orange: "bg-amber-50 border-amber-500 dark:bg-amber-950 dark:border-amber-500 dark:print:bg-amber-50 dark:print:border-amber-500",
  red: "bg-rose-50 border-rose-500 dark:bg-rose-950 dark:border-rose-500 dark:print:bg-rose-50 dark:print:border-rose-500",
};

const insightIcons = { check: CheckCircle2, up: ArrowUpCircle, alert: AlertTriangle };

/* ========================================================================
   PRESENTATIONAL COMPONENTS
   ======================================================================== */

function StatusDot({ tone }) {
  return <span className={`inline-block w-2 h-2 rounded-full ${dotTone[tone]}`} />;
}

function Panel({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 dark:print:bg-white border border-slate-200 dark:border-slate-800 dark:print:border-slate-300 rounded-lg print:shadow-none print:break-inside-avoid ${className}`}
    >
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 dark:print:border-slate-200">
        <h3 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 dark:print:text-slate-800 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 dark:print:text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Metric cards are the primary focal point of the dashboard, so the
// numeric value is deliberately the largest, boldest text on the page.
function MetricCard({ label, value, unit, status, tone, emphasize }) {
  if (emphasize) {
    return (
      <div className="bg-slate-900 dark:bg-slate-800 dark:print:bg-white border border-slate-900 dark:border-slate-700 dark:print:border-slate-300 rounded-lg p-6 flex flex-col justify-between">
        <span className="text-xs font-semibold text-slate-300 dark:text-slate-400 dark:print:text-slate-500 tracking-wide uppercase">
          {label}
        </span>
        <div className="mt-4">
          <span className="text-3xl md:text-4xl font-bold tracking-tight text-white dark:print:text-slate-900 tabular-nums">
            {value}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <StatusDot tone={tone} />
          <span className="text-xs font-medium text-slate-300 dark:text-slate-400 dark:print:text-slate-500">
            {status}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-slate-900 dark:print:bg-white border border-slate-200 dark:border-slate-800 dark:print:border-slate-300 rounded-lg p-6 flex flex-col justify-between">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:print:text-slate-500 tracking-wide uppercase">
        {label}
      </span>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 dark:print:text-slate-900 tabular-nums">
          {value}
        </span>
        {unit && <span className="text-base text-slate-400 dark:text-slate-500 font-medium">{unit}</span>}
      </div>
      <div className={`mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border ${badgeTone[tone]}`}>
        <StatusDot tone={tone} />
        {status}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
      <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950 opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-w-sm w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 print:hidden">
      <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium px-4 py-2.5 rounded-lg shadow-xl">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
        {message}
      </div>
    </div>
  );
}

function ChatWidget({ open, onToggle }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">AI Well-being Assistant</span>
            </div>
            <button
              onClick={onToggle}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto text-sm">
            {CHAT_MESSAGES.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`inline-block rounded-lg px-3 py-2 leading-relaxed ${
                    m.role === "user"
                      ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">This is a preview conversation.</p>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shadow-xl hover:bg-slate-800 dark:hover:bg-white transition-colors"
        aria-label="Toggle AI assistant"
      >
        {open ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>
    </div>
  );
}

/* ========================================================================
   MAIN DASHBOARD
   ======================================================================== */

export default function StudentWellbeingDashboard() {
  // Which mock student record is currently displayed.
  const [selectedId, setSelectedId] = useState("john");

  // Dark/light mode. Controls the `dark` class on the top-level wrapper —
  // see the Tailwind v4 note at the top of this file.
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Which action modal (if any) is open: "book" | "contact" | "request" | "connect" | null
  const [modalAction, setModalAction] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Toast confirmation message, cleared automatically after 3s.
  const [toast, setToast] = useState(null);

  // Floating AI chatbot open/closed state.
  const [chatOpen, setChatOpen] = useState(false);

  const student = STUDENTS[selectedId];

  // Load Inter for a clean, technical, academic typeface.
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Auto-dismiss toast notifications.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Recharts renders to SVG and cannot read Tailwind's `dark:` classes, so
  // chart colors are resolved directly from JS based on isDarkMode. Contrast
  // is deliberately high in both themes for readability.
  const chartColors = isDarkMode
    ? { grid: "#334155", axis: "#94a3b8", tooltipBg: "#0f172a", tooltipBorder: "#475569", tooltipText: "#f1f5f9", student: "#f1f5f9", teacher: "#94a3b8", cohort: "#64748b" }
    : { grid: "#e2e8f0", axis: "#64748b", tooltipBg: "#ffffff", tooltipBorder: "#cbd5e1", tooltipText: "#1e293b", student: "#1e293b", teacher: "#64748b", cohort: "#94a3b8" };

  function handleConfirm() {
    if (modalAction === "book") {
      if (!selectedSlot) return;
      setToast(`Consultation booked for ${selectedSlot}.`);
    } else if (modalAction === "contact") {
      setToast("Message sent to the University Psychologist.");
    } else if (modalAction === "request") {
      setToast("Coaching session requested.");
    } else if (modalAction === "connect") {
      setToast("Connection request sent to your peer mentor.");
    }
    setModalAction(null);
    setSelectedSlot(null);
  }

  function closeModal() {
    setModalAction(null);
    setSelectedSlot(null);
  }

  // The last insight in each student's array is treated as the priority
  // item and rendered as an elevated alert callout; the rest render as
  // plain rows. This keeps the "urgent" treatment purely data-driven.
  const priorityInsight = student.insights[student.insights.length - 1];
  const secondaryInsights = student.insights.slice(0, -1);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:print:bg-white text-slate-900 dark:text-slate-100 dark:print:text-slate-900 p-8 md:p-14 print:p-6"
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto space-y-10">
          {/* ------------------------------------------------------------ */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------ */}
          <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 dark:print:border-slate-300">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 dark:print:text-slate-900">
                Student Stress &amp; Well-being Dashboard
              </h1>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 dark:print:text-slate-500 mt-1.5">
                Real-time monitoring, assessment and support for student well-being
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              {/* Controls: hidden on print, visible on screen */}
              <div className="flex items-center gap-2 print:hidden">
                <label className="sr-only" htmlFor="student-select">Select student</label>
                <select
                  id="student-select"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
                >
                  {Object.values(STUDENTS).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-9 h-9 flex items-center justify-center rounded border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Export Report
                </button>
              </div>

              {/* Student info block: always visible, including on print */}
              <div className="text-sm text-slate-600 dark:text-slate-300 dark:print:text-slate-600 md:text-right space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-100 dark:print:text-slate-800">
                  Student: {student.name} (ID: {student.studentId})
                </div>
                <div className="text-slate-500 dark:text-slate-400 dark:print:text-slate-500">
                  Programme: {student.programme}
                </div>
                <div className="text-slate-500 dark:text-slate-400 dark:print:text-slate-500">
                  Semester: {student.semester}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs md:justify-end mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  Last update: {student.lastUpdate}
                </div>
              </div>
            </div>
          </header>

          {/* ------------------------------------------------------------ */}
          {/* Top metrics — numeric values are the visual anchor of each card */}
          {/* ------------------------------------------------------------ */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-2">
            <MetricCard label="Current Stress Score" {...student.metrics.stressScore} />
            <MetricCard label="Free Time Availability" {...student.metrics.freeTime} />
            <MetricCard label="Career Pressure" {...student.metrics.careerPressure} />
            <MetricCard label="Combined Risk Index" {...student.metrics.combinedRisk} emphasize />
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Analytics: trend line, factor table, radar comparison         */}
          {/* ------------------------------------------------------------ */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1">
            <Panel title="Stress Development Over Time" subtitle="Week 1 – Week 14">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={student.lineData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: chartColors.axis }}
                    axisLine={{ stroke: chartColors.grid }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[1, 5]}
                    tick={{ fontSize: 11, fill: chartColors.axis }}
                    axisLine={{ stroke: chartColors.grid }}
                    tickLine={false}
                    label={{ value: "Stress Level (1–5)", angle: -90, position: "insideLeft", fontSize: 10, fill: chartColors.axis }}
                  />
                  {/* High-contrast tooltip: solid background, bold label, larger padding */}
                  <Tooltip
                    contentStyle={{
                      fontSize: 13,
                      borderRadius: 8,
                      border: `1.5px solid ${chartColors.tooltipBorder}`,
                      background: chartColors.tooltipBg,
                      padding: "10px 12px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    }}
                    labelStyle={{ color: chartColors.tooltipText, fontWeight: 700, marginBottom: 4 }}
                    itemStyle={{ color: chartColors.tooltipText, fontWeight: 500 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: chartColors.axis }} />
                  {/* Thicker strokes for stronger on-screen and printed legibility */}
                  <Line type="monotone" dataKey="student" name="Student Self-Assessment" stroke={chartColors.student} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="teacher" name="Teacher Assessment" stroke={chartColors.teacher} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 2.5 }} />
                  <Line type="monotone" dataKey="cohort" name="Cohort Average" stroke={chartColors.cohort} strokeWidth={1.75} strokeDasharray="2 3" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Current Stress Profile" subtitle="Self vs. teacher assessment">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 dark:text-slate-500 dark:print:text-slate-400 uppercase tracking-wide">
                    <th className="font-medium pb-3">Factor</th>
                    <th className="font-medium pb-3 text-right">Self</th>
                    <th className="font-medium pb-3 text-right">Teacher</th>
                    <th className="font-medium pb-3 text-right pl-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {student.stressFactors.map((row) => (
                    <tr key={row.factor} className="border-t border-slate-100 dark:border-slate-800 dark:print:border-slate-200">
                      <td className="py-3 text-slate-700 dark:text-slate-300 dark:print:text-slate-700">{row.factor}</td>
                      <td className="py-3 text-right text-slate-800 dark:text-slate-100 dark:print:text-slate-800 font-semibold tabular-nums">
                        {row.self.toFixed(1)}
                      </td>
                      <td className="py-3 text-right text-slate-500 dark:text-slate-400 dark:print:text-slate-500 tabular-nums">
                        {typeof row.teacher === "number" ? row.teacher.toFixed(1) : row.teacher}
                      </td>
                      <td className="py-3 text-right pl-3">
                        <span className="inline-flex justify-end">
                          <StatusDot tone={row.status} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 dark:text-slate-500 dark:print:text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 dark:print:border-slate-200">
                Scale: 1 = Very Low, 5 = Very High
              </p>
            </Panel>

            <Panel title="Self vs Teacher Perception" subtitle="Six-dimension comparison">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={student.radarData} outerRadius="72%">
                  <PolarGrid stroke={chartColors.grid} />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: chartColors.axis }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9, fill: chartColors.axis }} tickCount={6} />
                  <Radar name="Student Self-Assessment" dataKey="self" stroke={chartColors.student} fill={chartColors.student} fillOpacity={0.18} strokeWidth={2.5} />
                  <Radar name="Teacher Assessment" dataKey="teacher" stroke={chartColors.cohort} fill={chartColors.cohort} fillOpacity={0.12} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 11, color: chartColors.axis }} />
                </RadarChart>
              </ResponsiveContainer>
            </Panel>
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Intervention: insights (with elevated priority callout) and   */}
          {/* recommended actions (with high-contrast, solid CTA buttons)   */}
          {/* ------------------------------------------------------------ */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
            <Panel title="AI Well-being Insights">
              <div className="space-y-4">
                {secondaryInsights.map((item, i) => {
                  const Icon = insightIcons[item.icon];
                  return (
                    <div key={i} className="flex gap-3">
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${toneText[item.tone]}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 dark:print:text-slate-800">
                          {item.label}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 dark:print:text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Elevated alert callout: left-border accent + tinted
                    background makes this read as active/urgent, not a
                    passive data point. */}
                {(() => {
                  const Icon = insightIcons[priorityInsight.icon];
                  return (
                    <div className={`flex gap-3 rounded-lg border-l-4 p-4 ${calloutTone[priorityInsight.tone]}`}>
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${toneText[priorityInsight.tone]}`} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 dark:print:text-slate-900">
                          {priorityInsight.label}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 dark:print:text-slate-600 mt-0.5">
                          {priorityInsight.text}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Panel>

            <Panel title="Recommended Actions">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map((a) => (
                  <div
                    key={a.key}
                    className="border border-slate-200 dark:border-slate-800 dark:print:border-slate-300 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all"
                  >
                    <div>
                      <a.icon className="w-4 h-4 text-slate-500 dark:text-slate-400 mb-2.5" />
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 dark:print:text-slate-800">
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 dark:print:text-slate-500 mt-1 leading-relaxed">
                        {a.desc}
                      </p>
                    </div>
                    {/* Solid, high-contrast CTA — this is an intervention
                        tool, so the action should feel immediate. */}
                    <button
                      onClick={() => setModalAction(a.key)}
                      className="mt-4 text-xs font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100 rounded px-3 py-2 w-fit hover:bg-slate-700 dark:hover:bg-white transition-colors print:hidden"
                    >
                      {a.cta}
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Bottom: AI recommendations and support access                */}
          {/* ------------------------------------------------------------ */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
            <Panel title="AI Recommendations">
              <p className="text-sm text-slate-600 dark:text-slate-300 dark:print:text-slate-600 leading-relaxed pb-5 mb-5 border-b border-slate-100 dark:border-slate-800 dark:print:border-slate-200">
                {student.recommendationIntro}
              </p>
              <ul className="space-y-4">
                {student.recommendations.map((r, i) => (
                  <li key={r.title} className="flex gap-3">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-4 pt-0.5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 dark:print:text-slate-800">
                        {r.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 dark:print:text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Support Access Panel">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 dark:text-slate-500 dark:print:text-slate-400 uppercase tracking-wide">
                    <th className="font-medium pb-3">Service</th>
                    <th className="font-medium pb-3">Availability</th>
                    <th className="font-medium pb-3 text-right">Next Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {supportServices.map((s) => (
                    <tr key={s.service} className="border-t border-slate-100 dark:border-slate-800 dark:print:border-slate-200">
                      <td className="py-3 text-slate-700 dark:text-slate-300 dark:print:text-slate-700">{s.service}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <StatusDot tone={s.tone} />
                          <span className="text-slate-600 dark:text-slate-300 dark:print:text-slate-600">{s.availability}</span>
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-500 dark:text-slate-400 dark:print:text-slate-500">{s.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a
                href="#"
                className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 dark:print:border-slate-200 flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors w-fit print:hidden"
              >
                View all support services
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Panel>
          </section>
        </div>

        {/* Action confirmation modal */}
        {modalAction && (
          <Modal title={MODAL_TITLES[modalAction]} onClose={closeModal}>
            {modalAction === "book" ? (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Choose a time for {student.name}'s consultation.
                </p>
                <div className="space-y-2 mb-4">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full text-left text-sm px-3 py-2 rounded border transition-colors ${
                        selectedSlot === slot
                          ? "border-slate-800 dark:border-slate-300 bg-slate-50 dark:bg-slate-800"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      } text-slate-700 dark:text-slate-200`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot}
                  className="w-full text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded px-3 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-white transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {modalAction === "contact" && `Send a message to the University Psychologist on behalf of ${student.name}.`}
                  {modalAction === "request" && `Request a coaching session for ${student.name}.`}
                  {modalAction === "connect" && `Send a connection request to a peer mentor for ${student.name}.`}
                </p>
                <button
                  onClick={handleConfirm}
                  className="w-full text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded px-3 py-2.5 hover:bg-slate-800 dark:hover:bg-white transition-colors"
                >
                  {modalAction === "contact" ? "Send Message" : "Send Request"}
                </button>
              </div>
            )}
          </Modal>
        )}

        {toast && <Toast message={toast} />}

        <ChatWidget open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      </div>
    </div>
  );
}