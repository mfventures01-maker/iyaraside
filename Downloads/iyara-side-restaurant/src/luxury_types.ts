
export interface IyaraLuxuryOrder {
    timestamp: string; // ISO String
    table: {
        id: string;
        zone: string;
        privacy_score: number;
        acoustics: string;
        sightlines: string[];
    };
    server: {
        id: string;
        expertise: string[];
        client_rapport: number;
        service_velocity: "anticipatory" | "standard" | "reactive";
    };
    items: LuxuryItem[];
    client_context: {
        current_mood: string;
        business_result?: string;
        celebration_mode?: string;
        next_visit_anticipation?: string;
    };
}

export interface LuxuryItem {
    type: "liquid_asset" | "culinary_masterpiece";
    name: string;
    vintage?: string;
    details: {
        serving_temp?: string;
        glassware?: string;
        presentation?: string;
        provenance?: string;
    };
    pricing: {
        amount: number;
        currency: "NGN" | "USD";
        display: "never" | "always" | "discreet";
        conversation: "discreet_nod" | "standard_bill";
    };
    scarcity?: string;
}

export interface ClientDossier {
    id: string;
    archetype: 'oil_magnate' | 'political_architect' | 'royal_scion' | 'global_tycoon';
    liquidPreferences: {
        whisky?: string;
        champagne?: string;
        palm_wine?: string;
        cocktail?: string;
    };
    culinaryPatterns: {
        spiciness?: string;
        allergies?: string[];
    };
    socialGeometry: {
        preferredSightlines: string[];
        privacyRadius: string;
    };
}
