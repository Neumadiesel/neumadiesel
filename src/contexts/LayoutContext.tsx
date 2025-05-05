'use client';
import { createContext, useContext, useState } from "react";

interface LayoutContextProps {
    hasChanged: boolean;
    setHasChanged: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextProps>({
    hasChanged: false,
    setHasChanged: () => { },
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [hasChanged, setHasChanged] = useState(false);

    return (
        <LayoutContext.Provider value={{ hasChanged, setHasChanged }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayoutContext = () => useContext(LayoutContext);