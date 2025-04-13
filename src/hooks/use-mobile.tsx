
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [])

  return isMobile;
}

// Add an alias for backward compatibility
export const useMobile = () => {
  const isMobile = useIsMobile()
  return { isMobile }
}
