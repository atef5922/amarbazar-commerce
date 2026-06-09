"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { activityNotifications } from "@/data/activityNotifications";

const initialDelay = 3000;
const visibleDuration = 5000;
const nextDelay = 12000;
const closeDelay = 12000;

export function ActivityPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const current = activityNotifications[index];

  useEffect(() => {
    isMountedRef.current = true;
    scheduleShow(initialDelay);

    return () => {
      isMountedRef.current = false;
      clearTimers();
    };
  }, []);

  function clearShowTimer() {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }

  function clearHideTimer() {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }

  function clearTimers() {
    clearShowTimer();
    clearHideTimer();
  }

  function scheduleShow(delay: number, advance = false) {
    clearShowTimer();
    showTimerRef.current = window.setTimeout(() => {
      if (!isMountedRef.current) return;
      if (advance) {
        setIndex((value) => (value + 1) % activityNotifications.length);
      }
      setVisible(true);
      scheduleHide();
    }, delay);
  }

  function scheduleHide(delay = visibleDuration) {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      if (!isMountedRef.current) return;
      if (isHoveredRef.current) return;
      setVisible(false);
      scheduleShow(nextDelay, true);
    }, delay);
  }

  function closePopup() {
    clearTimers();
    setVisible(false);
    scheduleShow(closeDelay, true);
  }

  function handleMouseEnter() {
    isHoveredRef.current = true;
    setIsHovered(true);
    clearHideTimer();
  }

  function handleMouseLeave() {
    isHoveredRef.current = false;
    setIsHovered(false);
    if (visible) {
      scheduleHide();
    }
  }

  const card = (
    <motion.div
      initial={{ opacity: 0, x: -40, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -40, y: 10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative flex w-[calc(100vw-24px)] max-w-[320px] gap-3 rounded-xl border border-zinc-100 bg-white p-3 pr-9 shadow-2xl ring-1 ring-zinc-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(34,34,34,0.16)] ${isHovered ? "scale-[1.02]" : ""}`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-soft">
        <Image src={current.image} alt={current.title} fill sizes="80px" className="object-contain p-1" />
      </div>
      <div className="min-w-0 py-1">
        <p className="text-sm font-black text-zinc-700">{current.title}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-500">{current.message}</p>
      </div>
      <button
        aria-label="Close notification"
        className="absolute right-2 top-2 grid h-7 w-7 place-items-center text-zinc-500 transition-colors hover:text-primary"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          closePopup();
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );

  return (
    <div className="pointer-events-none fixed bottom-24 left-3 z-50 md:bottom-6 md:left-6">
      <AnimatePresence mode="wait">
        {visible ? current.href ? (
          <Link key={current.id} href={current.href} className="block cursor-pointer" aria-label={current.message}>
            {card}
          </Link>
        ) : (
          <div key={current.id}>{card}</div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
