import { createContext, useContext, useState, useCallback } from 'react';

const QuoteContext = createContext({
  isOpen: false,
  initialCategory: '',
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
});

export function QuoteProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState('');

  const openQuoteModal = useCallback((category = '') => {
    setInitialCategory(category);
    setIsOpen(true);
  }, []);

  const closeQuoteModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <QuoteContext.Provider
      value={{
        isOpen,
        initialCategory,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuoteModal() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuoteModal must be used within a QuoteProvider');
  }
  return context;
}
