-- Migration: Iyara Luxury Suite Init
-- Created at: 2026-02-05
-- Description: Sets up the database schema for the Luxury Tier (Transactions, Provenance, Dossiers)

-- 1. Iyara Luxury Transactions
CREATE TABLE IF NOT EXISTS iyara_luxury_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_signature VARCHAR(64) UNIQUE, -- Cryptographic signature for privacy
  experience_timestamp TIMESTAMPTZ DEFAULT NOW(),
  settlement_timestamp TIMESTAMPTZ, -- Post-visit, never during
  total_amount DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'NGN', -- Standardizing on NGN for storage, display can apply FX
  discretion_level INT CHECK (discretion_level BETWEEN 1 AND 10),
  
  -- Service Intelligence
  service_velocity INTERVAL,
  anticipation_score DECIMAL(3,2),
  discretion_breaches INT DEFAULT 0,
  
  -- Client Experience Memory
  preferences_utilized JSONB,
  new_preferences_discovered JSONB,
  
  -- Analytics Dimensions
  client_archetype VARCHAR(50), -- 'oil_magnate', 'political_architect', 'royal_scion'
  visit_purpose VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for "Invisible" Querying
CREATE INDEX IF NOT EXISTS idx_iyara_client_exp 
  ON iyara_luxury_transactions (client_signature, experience_timestamp DESC)
  WHERE discretion_level >= 7;

-- 2. Liquid Assets Provenance (Blockchain-style tracking)
CREATE TABLE IF NOT EXISTS liquid_assets_provenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_name VARCHAR(255) NOT NULL,
    vintage VARCHAR(50),
    cask_number VARCHAR(100),
    distillation_year INT,
    warehouse_location VARCHAR(100),
    provenance_chain JSONB, -- Array of previous owners/locations
    current_status VARCHAR(50) DEFAULT 'VAULT', -- 'VAULT', 'TRANSIT', 'DECANTED', 'CONSUMED'
    purchase_price_usd DECIMAL(12,2),
    tasting_notes_encrypted TEXT
);

-- 3. Elite Client Dossiers (Mocking the CRM)
CREATE TABLE IF NOT EXISTS client_dossiers (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cryptographic_hash VARCHAR(64) UNIQUE NOT NULL,
    archetype VARCHAR(50),
    
    -- Preferences (stored as JSON for flexibility)
    liquid_preferences JSONB, -- { "whisky": "peaty", "champagne": "vintage" }
    culinary_patterns JSONB, -- { "spiciness": "high", "allergies": ["gold_leaf"] }
    social_geometry JSONB, -- { "sightlines": "corner", "privacy_radius": "2m" }
    
    last_visit TIMESTAMPTZ,
    lifetime_value DECIMAL(15,2) DEFAULT 0
);
