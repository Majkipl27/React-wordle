import { useLocation, useRoutes } from "react-router-dom";
import Header from "./Layout/Header";
import { ThemeProvider } from "./components/theme-provider";
import { cloneElement } from "react";

export default function App(): JSX.Element | null {
  const element = useRoutes([
    {
      path: "/",
      element: <Header />,
      children: [],
    },
  ]);

  const location = useLocation();
  if (!element) return null;

  return (
    <ThemeProvider>
      {cloneElement(element, { key: location.pathname })}
    </ThemeProvider>
  );
}
