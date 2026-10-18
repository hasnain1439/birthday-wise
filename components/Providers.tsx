"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { CakeModal } from "@/components/CakeModal";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { sfx } from "@/lib/sound";

const CakeContext = createContext<{ openCake: () => void }>({ openCake: () => {} });

export function useCake() {
  return useContext(CakeContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [welcome, setWelcome] = useState(true);
  const [open, setOpen] = useState(false);
  const openCake = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openCake }), [openCake]);

  return (
    <MotionConfig reducedMotion="user">
      <CakeContext.Provider value={value}>
        {children}
        <WelcomeOverlay
          open={welcome}
          onEnter={() => {
            setWelcome(false);
            setOpen(true);
          }}
        />
        <CakeModal
          open={open}
          onClose={() => {
            setOpen(false);
            sfx.startMusic();
          }}
        />
      </CakeContext.Provider>
    </MotionConfig>
  );
}
