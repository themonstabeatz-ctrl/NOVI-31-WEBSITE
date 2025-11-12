import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Massage from "./pages/Massage";
import Spa from "./pages/Spa";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
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
              <Route path="gallery" element={<Gallery />} />
              
              {/* Serbian URL Aliases - 301 Redirects */}
              <Route path="usluge" element={<Navigate to="/massage" replace />} />
              <Route path="cenovnik" element={<Navigate to="/spa" replace />} />
              <Route path="rezervacije" element={<Navigate to="/contact" replace />} />
              <Route path="kontakt" element={<Navigate to="/contact" replace />} />
              <Route path="o-nama" element={<Navigate to="/about" replace />} />
              <Route path="galerija" element={<Navigate to="/gallery" replace />} />
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