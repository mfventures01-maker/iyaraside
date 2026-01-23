import { supabase } from "../lib/supabaseClient";

export async function getOrCreateLoyaltyAccount(customerId: string, businessId: string) {
  const { data: existing } = await supabase
    .from("loyalty_accounts")
    .select("*")
    .eq("customer_id", customerId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("loyalty_accounts")
    .insert({
      customer_id: customerId,
      business_id: businessId,
      points: 0,
      lifetime_spend: 0,
      total_visits: 0,
      tier: "Bronze"
    })
    .select()
    .single();

  if (error) throw error;
  return created;
}

export function calculateTier(points: number) {
  if (points >= 150000) return "Platinum";
  if (points >= 50000) return "Gold";
  if (points >= 10000) return "Silver";
  return "Bronze";
}

export async function awardLoyaltyPoints({
  customerId,
  businessId,
  amount
}: {
  customerId: string;
  businessId: string;
  amount: number;
}) {
  try {
    const loyalty = await getOrCreateLoyaltyAccount(customerId, businessId);

    const pointsEarned = Math.floor(amount / 100);
    const newPoints = (loyalty.points || 0) + pointsEarned;
    const newTier = calculateTier(newPoints);

    const { error } = await supabase
      .from("loyalty_accounts")
      .update({
        points: newPoints,
        lifetime_spend: (loyalty.lifetime_spend || 0) + amount,
        total_visits: (loyalty.total_visits || 0) + 1,
        tier: newTier
      })
      .eq("id", loyalty.id);

    if (error) console.warn("Loyalty update failed:", error);
  } catch (err) {
    console.warn("Loyalty service error:", err);
  }
}