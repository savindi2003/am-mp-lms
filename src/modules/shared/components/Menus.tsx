"use client";

import {
  createContext,
  MouseEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useOutsideClick } from "@/modules/shared/hooks/useOutsideClick";
import { Button } from "@/modules/ui/button";

type Position = { x: number; y: number };

type MenusContextType = {
  openId: string;
  position: Position;
  setPosition: (pos: Position) => void;
  close: () => void;
  open: (id: string) => void;
};

const MenusContext = createContext<MenusContextType | undefined>(undefined);

type MenusProps = { children: ReactNode };

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const close = () => setOpenId("");
  const open = (id: string) => setOpenId(id);

  return (
    <MenusContext.Provider
      value={{ openId, position, setPosition, close, open }}
    >
      {children}
    </MenusContext.Provider>
  );
}

type ToggleProps = { id: string };

function Toggle({ id }: ToggleProps) {
  const ctx = useContext(MenusContext);
  if (!ctx) throw new Error("Toggle must be used within Menus");

  const { openId, close, open, setPosition } = ctx;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <button
      onClick={handleClick}
      className="w-fit focus:rounded focus:ring focus:ring-slate-500"
    >
      <HiEllipsisVertical size={22} className="cursor-pointer" />
    </button>
  );
}

type ListProps = { id: string; children: ReactNode };

function List({ id, children }: ListProps) {
  const ctx = useContext(MenusContext);
  if (!ctx) throw new Error("List must be used within Menus");

  const { openId, position, close } = ctx;
  const { ref } = useOutsideClick<HTMLUListElement>(close);

  // Only render portal after component mounts (avoids SSR "document is not defined")
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || openId !== id) return null;

  return createPortal(
    <ul
      style={{ top: `${position.y}px`, right: `${position.x}px` }}
      className="fixed shadow border border-slate-200 bg-slate-100 text-slate-300 transition duration-300 ease-in-out z-1001 space-y-1 px-1 py-1"
      ref={ref}
    >
      {children}
    </ul>,
    document.body,
  );
}

type ButtonMenuProps = {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  variant?:
    | "link"
    | "menu"
    | "close"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "gray"
    | null
    | undefined;
  disabled?: boolean;
};

function ButtonMenu({
  children,
  icon,
  onClick,
  variant,
  disabled,
}: ButtonMenuProps) {
  const ctx = useContext(MenusContext);
  if (!ctx) throw new Error("ButtonMenu must be used within Menus");

  const { close } = ctx;

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <Button onClick={handleClick} variant={variant} disabled={disabled}>
        <span className="flex items-center gap-1 text-left w-full">
          {" "}
          {icon}
          <span>{children}</span>
        </span>
      </Button>
    </li>
  );
}

Menus.Toggle = Toggle;
Menus.List = List;
Menus.ButtonMenu = ButtonMenu;

export default Menus;
