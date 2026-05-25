import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Calendar, Mail, Phone, MapPin, Sparkles, CheckCircle2, 
  ArrowRight, ChevronDown, Copy, Clock, User, BookOpen, Terminal, Check
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What mathematical integrator does Circuit.IQ use?",
    answer: "Our simulation engine utilizes a high-octane Semi-Implicit Euler integrator for speed and real-time responsiveness in the browser, paired with a Runge-Kutta 4th Order (RK4) solver for high-fidelity offline calculations and precise vector states."
  },
  {
    question: "Can I export simulation telemetry data?",
    answer: "Yes! All active laboratory experiments support exporting raw physical data (velocity vectors, kinetic/potential energy levels, angular momentum) as standard IEEE-754 compliant CSV sheets or structural JSON state payloads directly from the live sandbox UI."
  },
  {
    question: "How do I sync custom circuit components?",
    answer: "Circuit.IQ supports custom SPICE netlist imports and custom schematic nodes. You can link your local components within the Virtual Lab block editor or build procedural node pipelines in real-time."
  },
  {
    question: "Are academic and student institutional plans available?",
    answer: "Absolutely. Secondary education classes and university research institutions can acquire bulk license credentials allowing administrative course tracking, custom sandbox workspace distribution, and cloud-saved simulation templates."
  }
];

export default function ContactPage() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Validation / Submission states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  // Scheduler Widget State
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Copy Feedback state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Simulated validation checker
  const handleValidate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Engineer, name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please specify a valid scientific email address.";
    if (!subject.trim()) newErrors.subject = "Subject header is required.";
    if (message.trim().length < 10) newErrors.message = "Please clarify your parameters (minimum 10 characters).";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simulated Console Handshake submission
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidate()) return;

    setIsSubmitting(true);
    setSubmitLogs([]);
    setSubmitStep(1);

    const steps = [
      "Establishing sub-atomic socket connection... [OK]",
      "Validating cryptography session parameters... [OK]",
      "Encrypting transmission payload via 256-bit AES... [OK]",
      "Resolving routing path: circuit-iq_inbound_queue... [OK]",
      "Submitting telemetry parameters to Live Support database... [SUCCESS]"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 500 : 800));
      setSubmitLogs((prev) => [...prev, steps[i]]);
      setSubmitStep(i + 2);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const randomTicket = `CIQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(randomTicket);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleCopyText = (text: string, type: 'email' | 'coords') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  // Calculate days for interactive scheduler
  const today = new Date();
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i + 1);
    return nextDay;
  });

  const availableHours = ["09:00 UTC", "11:30 UTC", "14:00 UTC", "16:30 UTC"];

  const handleBookCall = () => {
    if (selectedDate === null || !selectedTime) return;
    setScheduleSuccess(true);
    setTimeout(() => {
      setSelectedDate(null);
      setSelectedTime(null);
      setScheduleSuccess(false);
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen bg-transparent pt-32 pb-24 px-4 sm:px-6 md:px-8 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Decorative Science Grid Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Dynamic Ambient Glowing Accents */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-12 lg:gap-16">
        
        {/* Cinematic Page Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-[10px] font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry Center</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Connect with Circuit.<span className="text-blue-600">IQ</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 max-w-xl text-center text-sm md:text-base leading-relaxed"
          >
            Have simulation equations to submit, custom integration challenges, or questions about educational licensing? Drop our computational response team a vector.
          </motion.p>
        </div>

        {/* Form & Support split columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-8 xl:gap-12 items-start">
          
          {/* Column 1: Science Form glass-panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-black/45 border border-slate-200 dark:border-white/5 shadow-2x rounded-3xl p-6 sm:p-8 backdrop-blur-3xl relative"
          >
            <div className="border-b border-slate-100 dark:border-white/5 pb-5 mb-6 text-left">
              <h2 className="text-lg font-display font-medium text-slate-900 dark:text-white">Engineering Transmission Portal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Specify your simulation parameters to dispatch an instant support handshake payload.</p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <form onSubmit={handleSubmitForm} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span>Operator Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Marie Curie"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                        disabled={isSubmitting}
                        className={cn(
                          "w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 dark:bg-black/30 outline-none transition-all",
                          errors.name
                            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-200 focus:ring-opacity-50"
                            : "border-slate-200 dark:border-white/10 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-black/60"
                        )}
                      />
                      {errors.name && <span className="text-[10px] text-red-500 font-mono mt-0.5">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        <span>Computational Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="operator@laboratory.edu"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
                        disabled={isSubmitting}
                        className={cn(
                          "w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 dark:bg-black/30 outline-none transition-all",
                          errors.email
                            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-200 focus:ring-opacity-50"
                            : "border-slate-200 dark:border-white/10 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-black/60"
                        )}
                      />
                      {errors.email && <span className="text-[10px] text-red-500 font-mono mt-0.5">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Role selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span>Interactive Role</span>
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/30 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-black/60 transition-all cursor-pointer"
                      >
                        <option value="Student">Student Explorer</option>
                        <option value="Professor">Academic Researcher / Professor</option>
                        <option value="Hobbyist">Physics Hobbyist</option>
                        <option value="Institution">Institutional Admin</option>
                        <option value="Other">Custom Constructor</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>Subject Track</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Solver Integration Error"
                        value={subject}
                        onChange={(e) => { setSubject(e.target.value); if (errors.subject) setErrors(prev => ({ ...prev, subject: '' })); }}
                        disabled={isSubmitting}
                        className={cn(
                          "w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 dark:bg-black/30 outline-none transition-all",
                          errors.subject
                            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-200 focus:ring-opacity-50"
                            : "border-slate-200 dark:border-white/10 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-black/60"
                        )}
                      />
                      {errors.subject && <span className="text-[10px] text-red-500 font-mono mt-0.5">{errors.subject}</span>}
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-blue-500" />
                      <span>Diagnostics / Custom Message</span>
                    </label>
                    <textarea
                      placeholder="Describe the physical collision coordinates or system inquiries you're analyzing..."
                      rows={5}
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors(prev => ({ ...prev, message: '' })); }}
                      disabled={isSubmitting}
                      className={cn(
                        "w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 dark:bg-black/30 outline-none transition-all resize-none",
                        errors.message
                          ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-200 focus:ring-opacity-50"
                          : "border-slate-200 dark:border-white/10 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-black/60"
                      )}
                    />
                    {errors.message && <span className="text-[10px] text-red-500 font-mono mt-0.5">{errors.message}</span>}
                  </div>

                  {/* Dynamic Submitting Handshake Console */}
                  <AnimatePresence>
                    {isSubmitting && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black text-emerald-400 rounded-xl p-4 font-mono text-xs border border-emerald-500/20 shadow-inner overflow-hidden flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-1.5 text-emerald-500 font-bold uppercase tracking-wider text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Console Handshake Pipeline Progress</span>
                        </div>
                        <div className="space-y-1 mt-1 font-mono text-[10px] text-emerald-300">
                          {submitLogs.map((log, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ x: -10, opacity: 0 }} 
                              animate={{ x: 0, opacity: 1 }}
                              className="flex items-center gap-1.5"
                            >
                              <span>⚡</span>
                              <span>{log}</span>
                            </motion.div>
                          ))}
                          <div className="flex items-center gap-1 text-emerald-500 animate-pulse mt-1">
                            <span>┌</span>
                            <span className="dot-pulse-stream">Processing step #{submitStep}...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-blue-600 dark:bg-white hover:bg-blue-700 dark:hover:bg-slate-150 text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all hover:shadow-lg dark:hover:shadow-white/5 disabled:opacity-50 select-none group focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span>Dispatch Payload Ticket</span>
                    <Send size={16} className="transform group-hover:translate-x-1 duration-200" />
                  </button>
                </form>
              ) : (
                /* Success Animated State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 px-4 flex flex-col items-center justify-center text-center gap-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/25 flex items-center justify-center text-emerald-500 relative">
                    <CheckCircle2 size={36} className="animate-pulse" />
                    <div className="absolute inset-x-0 -bottom-1 text-[9px] font-mono text-emerald-500 bg-emerald-500/20 px-1 border border-emerald-500/30 rounded py-0.2 select-none uppercase font-bold">DISPATCHED</div>
                  </div>

                  <div className="flex flex-col gap-2 max-w-md">
                    <h3 className="text-xl font-display font-medium text-slate-900 dark:text-white">Scientific Dispatch Logged</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your packet was compiled and processed securely without telemetry packet loss. Computational assistance has logged your report.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl p-4 font-mono text-xs w-full max-w-sm flex flex-col gap-2 shadow-inner text-left">
                    <div className="flex justify-between items-center border-b border-dashed border-slate-200 dark:border-white/10 pb-2 mb-1">
                      <span className="text-slate-400 text-[10px]">TICKET ID:</span>
                      <strong className="text-blue-500 text-[13px]">{ticketId}</strong>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">OPERATOR:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{name}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">ROLE:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{role}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">METAPATH:</span>
                      <span className="text-emerald-500">circuit-iq-telemetry</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
                  >
                    <span>Send Another Ticket</span>
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Column 2: Support Cards & Scheduler */}
          <div className="flex flex-col gap-6">
            
            {/* Quick Contact metrics glass cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-black/35 border border-slate-100 dark:border-white/5 shadow-xl rounded-3xl p-6 backdrop-blur-2xl flex flex-col gap-4 text-left"
            >
              <h3 className="text-sm font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Laboratory Coordinates</span>
              </h3>
              
              <div className="space-y-3.5">
                {/* Email Support Card */}
                <div 
                  onClick={() => handleCopyText("operations@circuit-iq.org", 'email')}
                  className="group bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 cursor-pointer rounded-2xl p-4 flex justify-between items-center transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500">
                      <Mail size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-medium text-slate-500 uppercase">Interactive Email</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">operations@circuit-iq.org</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-mono text-blue-500 group-hover:underline flex items-center gap-1">
                    {copiedEmail ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500 font-bold">COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Simulated Physical coordinates address */}
                <div 
                  onClick={() => handleCopyText("37.7749° N, 122.4194° W", 'coords')}
                  className="group bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 cursor-pointer rounded-2xl p-4 flex justify-between items-center transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500">
                      <MapPin size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-medium text-slate-500 uppercase">Coordinates / Office</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Suite 101, Science Park Silicon Valley</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-mono text-blue-500 group-hover:underline flex items-center gap-1">
                    {copiedCoords ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500 font-bold">COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Premium Interactive Live Call Scheduler Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-black/35 border border-slate-100 dark:border-white/5 shadow-xl rounded-3xl p-6 backdrop-blur-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex flex-col justify-start">
                <h3 className="text-sm font-display font-medium text-slate-800 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Reserve Telemetry Call Slot</span>
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5">Pick an open calendar sector below to simulate booking a 15 min review.</span>
              </div>

              <AnimatePresence mode="wait">
                {!scheduleSuccess ? (
                  <div className="space-y-4">
                    {/* Date Horizontal Selector */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Available Science Sectors:</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {calendarDays.slice(0, 4).map((day, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedDate(idx)}
                            className={cn(
                              "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer",
                              selectedDate === idx
                                ? "bg-blue-600 dark:bg-white text-white dark:text-slate-900 border-blue-600 dark:border-white shadow"
                                : "bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 dark:text-gray-300"
                            )}
                          >
                            <span className="text-[8px] font-mono uppercase text-slate-400 select-none">
                              {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className="text-xs font-bold leading-none mt-1">
                              {day.getDate()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selector */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Open Window Slots (AM/PM):</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {availableHours.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "py-2 text-[10px] font-mono border rounded-lg text-center transition-all cursor-pointer",
                              selectedTime === time
                                ? "bg-blue-600 dark:bg-white text-white dark:text-slate-900 border-blue-600 dark:border-white"
                                : "bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 dark:text-gray-300"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={handleBookCall}
                      disabled={selectedDate === null || !selectedTime}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white border border-slate-100 dark:border-white/10 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Calendar size={13} />
                      <span>Request Science Review</span>
                    </button>
                  </div>
                ) : (
                  /* Success scheduler */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-1">
                      <Check size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">Session Reserved Successfully!</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Dispatched confirmation vector coordinate to your selected operator logs. Telemetry sync is complete.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Science Accordion Question disclosures */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto w-full flex flex-col gap-5 text-left"
        >
          <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-2 text-center md:text-left">
            <h3 className="text-xl font-display font-medium text-slate-900 dark:text-white flex items-center gap-2 justify-center md:justify-start">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Computational Research Disclosure (FAQ)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review critical calculations and structural telemetry patterns before deploying custom experiments.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-black/25 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left outline-none text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-white/2 cursor-pointer transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold">{faq.question}</span>
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "text-slate-400 group-hover:text-white shrink-0 duration-300 transition-transform",
                        isOpen ? "transform rotate-180 text-blue-500" : ""
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
