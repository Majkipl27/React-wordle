import { ModeToggle } from "@/components/mode-toggle";
import { Outlet } from "react-router-dom";

export default function Header(): JSX.Element {
  return (
    <>
      <header className="prose max-w-none flex justify-end items-center py-4 px-8">
        <ModeToggle />
      </header>
      <Outlet />
    </>
  );
}