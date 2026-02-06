
import json
import random
from datetime import datetime

class IyaraStaffOrchestrator:
    """
    The brain behind the invisible service.
    Matches the specific nuances of a client (Archetype) with the unique
    talents of the staff (Expertise).
    """
    
    def __init__(self):
        # The 'Matrix' of Iyara's finest
        self.staff_roster = {
            'butler_chioma': {
                'id': 'stf_001',
                'name': 'Chioma',
                'specialties': ['presidential_service', 'cognac_rituals', 'igbo_customary_protocols'],
                'client_affinity': ['political_architect', 'oil_magnate'],
                'discretion_rating': 10.0,
                'status': 'active'
            },
            'mixologist_tunde': {
                'id': 'stf_002',
                'name': 'Tunde',
                'specialties': ['local_fusion', 'molecular_cocktails', 'storytelling'],
                'client_affinity': ['royal_scion', 'celebrity_diplomat'],
                'discretion_rating': 9.8,
                'status': 'active'
            },
            'sommelier_emeka': {
                'id': 'stf_003',
                'name': 'Emeka',
                'specialties': ['vintage_champagne', 'palm_wine_tasting_notes'],
                'client_affinity': ['global_tycoon', 'legacy_family_scion'],
                'discretion_rating': 9.9,
                'status': 'active'
            }
        }
        
    def assign_to_table(self, client_archetype, table_zone, current_mood="neutral"):
        """
        Quantum staff assignment for Asaba Elite.
        """
        print(f"🕵️  Orchestrator analyzing: {client_archetype} in {table_zone} (Mood: {current_mood})")
        
        candidates = []
        for staff_id, profile in self.staff_roster.items():
            score = 0
            
            # Affinity Bonus
            if client_archetype in profile['client_affinity']:
                score += 50
                
            # Discretion Check (Absolute requirement)
            if profile['discretion_rating'] < 9.5:
                continue # Disqualified for luxury tier
                
            score += profile['discretion_rating'] * 10
            
            candidates.append((staff_id, score))
            
        # Sort by score descending
        candidates.sort(key=lambda x: x[1], reverse=True)
        
        if not candidates:
            return "senior_manager_override"
            
        selected_staff = self.staff_roster[candidates[0][0]]
        print(f"✅ Staff Assigned: {selected_staff['name']} (Match Score: {candidates[0][1]})")
        return selected_staff

    def calculate_anticipation_bonus(self, staff_id, predicted_item, actual_item):
        """
        Reward psychic service.
        """
        if predicted_item == actual_item:
            return {
                "bonus_type": "psychic_service",
                "value": "spot_bonus"
            }
        return None

if __name__ == "__main__":
    # Test the Orchestrator
    orchestrator = IyaraStaffOrchestrator()
    
    # Simulation 1: A Politician arrives
    orchestrator.assign_to_table("political_architect", "whisper_zone_A", "strategic_planning")
    
    # Simulation 2: A Royal arrives
    orchestrator.assign_to_table("royal_scion", "vip_lounge", "celebratory")
