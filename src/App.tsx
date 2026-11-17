/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SoundProvider } from './context/SoundContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { NavigationProvider } from './context/NavigationContext';
import { FloatingChrome } from './components/FloatingChrome';
import { CurvedCurtain } from './components/CurvedCurtain';
import { EntryIntro } from './components/EntryIntro';
import { MagneticCursor } from './components/MagneticCursor';
import { ScrollThread } from './components/ScrollThread';
import { HomePage } from './pages/HomePage';
import { WorksPage } from './pages/WorksPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactsPage } from './pages/ContactsPage';
import { DomeWorksPage } from './pages/DomeWorksPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SoundProvider>
          <ProjectsProvider>
            <BrowserRouter>
              <NavigationProvider>
                <div className="min-h-screen flex flex-col bg-[#EFEFE9] text-[#0B0B0B] dark:bg-[#0C0C0F] dark:text-[#EFEFE9] transition-colors duration-300">
                  <MagneticCursor />
                  <ScrollThread />
                  <EntryIntro />
                  <CurvedCurtain />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/works" element={<WorksPage />} />
                      <Route path="/dome" element={<DomeWorksPage />} />
                      <Route path="/works/:slug" element={<CaseStudyPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contacts" element={<ContactsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <FloatingChrome />
                </div>
              </NavigationProvider>
            </BrowserRouter>
          </ProjectsProvider>
        </SoundProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
