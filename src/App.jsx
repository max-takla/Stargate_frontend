import "./App.css";
import { createContext, lazy, Suspense, useEffect, useState } from "react";
import ErrorBoundary from "./Components/LazyLoad/ErrorBoundary";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";
const Router = lazy(() => import("./Routers/Router"));
export const AppContext = createContext();
function App() {
  const [dark, setDark] = useState(
    JSON.parse(localStorage.getItem("dark")) || false
  );
  const {t}=useTranslation();
  let root = document.querySelector("#root");
    const [mainColor, setMainColor] = useState(dark ? "#010052" : "#9d9ce2ff");
    const [secondColor, setSecondColor] = useState(dark ? "#0E7187" : "#5d8188ff");
    const [hoverColor, setHoverColor] = useState(dark ? "#247ACA" : "#9fb4c8ff");
  // Translate
  const initialLang = localStorage.getItem("lang") || i18n.language || "en";
  const [en, setEn] = useState(initialLang === "en");
  // Dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDark(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);
  // Set the i18n language when app loads
  useEffect(() => {
    const lang = en ? "en" : "ar";
    i18n.changeLanguage(lang);
  }, [en]);
   useEffect(() => {
      localStorage.setItem("darkMode", JSON.stringify(dark));
      if (dark !== null) {
        setMainColor(!dark ? "#010052" : "#9d9ce2ff");
        setSecondColor(!dark ? "#0E7187" : "#5d8188ff");
        setHoverColor(!dark?"#247ACA":"#9fb4c8ff")
      }
    }, [dark]);
  return(
    <ErrorBoundary>
        <AppContext.Provider
          value={{
            mainColor,
            setMainColor,
            en,
            setEn,
            dark,
            setDark,
            hoverColor,
            setHoverColor,
            secondColor,
            setSecondColor,
          }}
        >
          <Suspense
            fallback={
              <div>
                <div
                  className="loader"
                  style={{ borderTop: `8px solid ${mainColor}` }}
                ></div>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "18px",
                    color: mainColor,
                    textAlign: "center",
                  }}
                >
                  {t("loading")}...
                </p>
              </div>
            }
          >
            <Router />
          </Suspense>
          {dark && <DarkModeOverlay />}
        </AppContext.Provider>
      </ErrorBoundary>
  
  );
}
function DarkModeOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.508)",
        zIndex: -1,
      }}
    />
  );
}

export default App;
