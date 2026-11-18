import React from 'react';
import { PetBackdrop } from './components/PetBackdrop';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HamburgerDrawer } from './components/HamburgerDrawer';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import {
  InstitutionalHistoryModal,
  PrivacyPolicyModal,
  ToastContainer,
} from './components/Modals';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/admin/AdminPage';

const AppContent: React.FC = () => {
  const { route } = useStore();

  if (route === '/admin') {
    return (
      <>
        <AdminPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="relative isolate min-h-screen flex flex-col text-[#20322A]">
      <PetBackdrop />
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {route === '/' && <HomePage />}
            {route === '/loja' && <StorePage />}
            {route === '/servicos' && <ServicesPage />}
            {route === '/sobre' && <AboutPage />}
            {route === '/galeria' && <GalleryPage />}
            {route === '/contato' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <HamburgerDrawer />
      <CartDrawer />
      <InstitutionalHistoryModal />
      <PrivacyPolicyModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </MotionConfig>
  );
}
