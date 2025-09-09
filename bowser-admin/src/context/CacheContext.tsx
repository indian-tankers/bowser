"use client";
import { TransAppUser, TripStatusUpdateEnums } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

export type CacheData = {
    user?: TransAppUser;
    filter?: 'all' | 'loadedOnWay' | 'loadedReported' | 'emptyOnWay' | 'emptyReported' | 'emptyStanding' | 'outsideStandingVehicles' | 'notLoadedVehicles' | 'loaded';
    viewingTrip?: string | null;
    searchTerm?: string;
    allVehiclesAccordion?: string;
    statusUpdate?: { tripId: string; status: TripStatusUpdateEnums; comment?: string } | null;
};

type CacheContextType = {
    cache: CacheData;
    setCache: (updater: (prev: CacheData) => CacheData) => void;
    clearCache: () => void;
};

const CacheContext = createContext<CacheContextType | null>(null);

export const CacheProvider = ({ children }: { children: React.ReactNode }) => {
    const [cache, setCacheState] = useState<CacheData>({});

    // Load from sessionStorage
    useEffect(() => {
        const saved = sessionStorage.getItem("tripSummaryCache");
        if (saved) {
            const parsed = JSON.parse(saved);
            const now = Date.now();
            // Reset if cache is from another day
            if (!parsed.timestamp || new Date(parsed.timestamp).toDateString() !== new Date().toDateString()) {
                sessionStorage.removeItem("tripSummaryCache");
            } else {
                setCacheState(parsed.data);
            }
        }
    }, []);

    // Save whenever cache changes
    useEffect(() => {
        sessionStorage.setItem(
            "tripSummaryCache",
            JSON.stringify({ data: cache, timestamp: Date.now() })
        );
    }, [cache]);

    const setCache = (updater: (prev: CacheData) => CacheData) =>
        setCacheState((prev) => updater(prev));

    const clearCache = () => setCacheState({});

    return (
        <CacheContext.Provider value={{ cache, setCache, clearCache }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => {
    const ctx = useContext(CacheContext);
    if (!ctx) throw new Error("useCache must be used inside CacheProvider");
    return ctx;
};
