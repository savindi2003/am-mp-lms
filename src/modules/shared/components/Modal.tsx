"use client";

import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "@/modules/shared/hooks/useOutsideClick";
import { Button } from "@/modules/ui/button"; // adjust import if needed

// ----------------- Context Types -----------------
type ModalContextType = {
  openName: string;
  close: () => void;
  open: (name: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// ----------------- Modal Root -----------------
function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState<string>("");
  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// ----------------- Modal.Open -----------------
type OpenProps = {
  children: ReactElement<{ onClick?: () => void }>;
  opens: string;
};

function Open({ children, opens }: OpenProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal.Open must be used inside Modal");
  const { open } = ctx;

  return cloneElement(children, {
    onClick: () => open(opens),
  });
}

// ----------------- Modal.Window -----------------
type WindowProps = {
  children: ReactElement<{ onCloseModal: () => void }>;
  name: string;
};

function Window({ children, name }: WindowProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal.Window must be used inside Modal");
  const { openName, close } = ctx;
  const { ref } = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-0 left-0 z-1003 h-dvh w-full overflow-auto bg-slate-900/10 backdrop-blur-xs">
      <div
        ref={ref}
        className="
    fixed
    left-1/2
    top-1/2
    -translate-x-1/2
    -translate-y-1/2
    bg-slate-50
    
    shadow-lg
    px-4
    py-5
    transition-all
    duration-300

    w-[95vw]
    sm:w-fit
    max-w-[95vw]
    max-h-[90vh]

    overflow-y-auto
  "
      >
        <div className="ml-auto w-fit">
          <Button onClick={close} className="cursor-pointer" variant="close">
            <HiXMark size={20} strokeWidth={1} />
          </Button>
        </div>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body,
  );
}

// ----------------- Assign Compound Components -----------------
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
