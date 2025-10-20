import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Massage from "./pages/Massage";
import Spa from "./pages/Spa";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="massage" element={<Massage />} />
              <Route path="spa" element={<Spa />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>
          </Routes>
          <Toaster 
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#f5f2e8',
              },
            }}
          />
        </BrowserRouter>
      </LanguageProvider>
    </div>
  );
}

export default App;