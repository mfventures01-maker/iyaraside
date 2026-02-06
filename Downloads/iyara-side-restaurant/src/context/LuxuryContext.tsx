
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LuxuryItem, IyaraLuxuryOrder } from '../luxury_types';
import liquidAssetsData from './liquid_assets.json';

interface LuxuryContextType {
    isLuxuryMode: boolean;
    toggleLuxuryMode: () => void;
    liquidAssets: LuxuryItem[];
    createInvisibleOrder: (items: LuxuryItem[], tableId: string) => void;
    discretionScore: number;
}

const LuxuryContext = createContext<LuxuryContextType | undefined>(undefined);

export const LuxuryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLuxuryMode, setIsLuxuryMode] = useState(false);
    const [liquidAssets, setLiquidAssets] = useState<LuxuryItem[]>([]);
    const [discretionScore, setDiscretionScore] = useState(10.0);

    useEffect(() => {
        // Transform the raw JSON into our typed structure
        const assets: LuxuryItem[] = liquidAssetsData.map((item: any) => ({
            type: item.type,
            name: item.name,
            vintage: item.vintage,
            details: item.details,
            pricing: {
                amount: item.price_ngn,
                currency: 'NGN', // Defaulting to NGN for now
                display: 'never',
                conversation: 'discreet_nod'
            },
            scarcity: item.scarcity
        }));
        setLiquidAssets(assets);
    }, []);

    const toggleLuxuryMode = () => {
        setIsLuxuryMode(prev => !prev);
        // Simulation: entering luxury mode resets discretion score
        if (!isLuxuryMode) {
            console.log("🌌 Entering Defacto Mode: DISCRETION SHIELD ACTIVE");
        }
    };

    const createInvisibleOrder = (items: LuxuryItem[], tableId: string) => {
        const order: IyaraLuxuryOrder = {
            timestamp: new Date().toISOString(),
            table: {
                id: tableId,
                zone: 'whisper_zone_A',
                privacy_score: 9.9,
                acoustics: 'soundproof',
                sightlines: ['river']
            },
            server: {
                id: 'stf_001',
                expertise: ['luxury_service'],
                client_rapport: 9.9,
                service_velocity: 'anticipatory'
            },
            items: items,
            client_context: {
                current_mood: 'expectant'
            }
        };

        console.log("🍸 INVISIBLE ORDER DISPATCHED:", order);
        // In real app, push to Supabase
    };

    return (
        <LuxuryContext.Provider value={{
            isLuxuryMode,
            toggleLuxuryMode,
            liquidAssets,
            createInvisibleOrder,
            discretionScore
        }}>
            {children}
        </LuxuryContext.Provider>
    );
};

export const useLuxury = () => {
    const context = useContext(LuxuryContext);
    if (context === undefined) {
        throw new Error('useLuxury must be used within a LuxuryProvider');
    }
    return context;
};
