"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { CakeModal } from "@/components/CakeModal";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { installAudioUnlock } from "@/lib/sound";

const CakeContext = createContext<{ openCake: () => void }>({ openCake: () => {} });

export function useCake() {
  return useContext(CakeContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [welcome, setWelcome] = useState(true);
  const [open, setOpen] = useState(false);
  const [autoCelebrate, setAutoCelebrate] = useState(false);

  // Opened from a button on the page: the interactive version (blow candles yourself).
  const openCake = useCallback(() => {
    setAutoCelebrate(false);
    setOpen(true);
  }, []);
  const closeCake = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openCake }), [openCake]);

  useEffect(() => installAudioUnlock(), []);

  return (
    <MotionConfig reducedMotion="user">
      <CakeContext.Provider value={value}>
        {children}
        <WelcomeOverlay
          open={welcome}
          onEnter={() => {
            setWelcome(false);
            setAutoCelebrate(true);
            setOpen(true);
          }}
        />
        <CakeModal open={open} onClose={closeCake} autoCelebrate={autoCelebrate} />
      </CakeContext.Provider>
    </MotionConfig>
  );
}
