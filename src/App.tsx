import { useLocation, useRoutes } from "react-router-dom";
import Header from "./Layout/Header";
import { ThemeProvider } from "./components/theme-provider";
import { cloneElement } from "react";
import LandingPage from "./Pages/LandingPage";
import { AnimatePresence } from "framer-motion";
import Play from "./Pages/Play";
import { Toaster } from "./components/ui/sonner";

export default function App(): JSX.Element | null {
  const element = useRoutes([
    {
      path: "/",
      element: <Header />,
      children: [
        { path: "/", element: <LandingPage /> },
        {
          path: "play",
          element: <Play />,
        },
      ],
    },
  ]);

  const location = useLocation();
  if (!element) return null;

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <Toaster />
        {cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
    </ThemeProvider>
  );
}
