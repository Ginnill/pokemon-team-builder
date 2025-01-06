import React, { ReactNode } from "react";
import useScrollToTop from "../hooks/useScrollToTop";

interface ScrollToTopWrapperProps {
  children: ReactNode;
}

const ScrollToTopWrapper: React.FC<ScrollToTopWrapperProps> = ({ children }) => {
  useScrollToTop(); // Ativa o comportamento de rolar para o topo
  return <>{children}</>;
};

export default ScrollToTopWrapper;
