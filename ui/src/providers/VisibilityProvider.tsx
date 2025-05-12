import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { isEnvBrowser } from "../utils/misc";

interface VisibilityProviderValue {
  setVisible: (visible: boolean) => void;
  visible: boolean;
}

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);

export const VisibilityProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);

  // Hook que escuta o evento vindo do Lua: SendNUIMessage({ action: 'setVisible', data: true/false })
  useNuiEvent<boolean>("setVisible", setVisible);

  // Fecha o frame ao pressionar ESC/Backspace dentro da NUI
  useEffect(() => {
    if (!visible) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (["Backspace", "Escape"].includes(e.code)) {
        fetchNui("hideFrame");
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible]);

  useEffect(() => {
    if (isEnvBrowser()) {
      setVisible(true);
    }
  }, []);

  return (
    <VisibilityCtx.Provider value={{ visible, setVisible }}>
      <div
        style={{ visibility: visible ? "visible" : "hidden", height: "100%" }}
      >
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = (): VisibilityProviderValue => {
  const ctx = useContext<VisibilityProviderValue | null>(VisibilityCtx);
  if (!ctx)
    throw new Error("useVisibility must be used within VisibilityProvider");
  return ctx;
};
