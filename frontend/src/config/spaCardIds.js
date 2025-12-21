/**
 * 🔐 SPA CARD IDs - Centralized constants for card-level discounts
 * 
 * These IDs map to backend /api/spa/cards endpoints
 * Used in /api/spa/quote requests to apply card-level discounts
 * 
 * ⚠️ DO NOT hardcode card_id in components - always use these constants!
 */

export const SPA_CARD_IDS = {
  // SPA Rituals (main packages)
  SILKY_BODY_RITUAL: "silky_body_ritual",
  GENTLE_TOUCH_RITUAL: "gentle_touch_ritual",
  DEEP_RENEWAL_RITUAL: "deep_renewal_ritual",

  // Herbal Rituals (fixed-price packages)
  SILKY_HERBAL_COMPRESS_RITUAL: "silky_herbal_compress_ritual",
  THAI_HERBAL_COMPRESS_RITUAL: "thai_herbal_compress_ritual",
  AROMA_STONE_HARMONY_RITUAL: "aroma_stone_harmony_ritual",

  // SPA Zone card (zone-only booking)
  SPA_ZONE: "spa_zone",

  // Special occasions / Couple packages
  ROMANTIC_COUPLE_PACKAGE: "romantic_couple_package",
  ROMANTIC_PEELING_COUPLE_PACKAGE: "romantic_peeling_couple_package",
};

/**
 * Map frontend package IDs to backend card IDs
 * Used to look up which card_id to send in quote request
 */
export const PACKAGE_TO_CARD_MAP = {
  // Main SPA Rituals
  "SPA1": SPA_CARD_IDS.SILKY_BODY_RITUAL,
  "SPA2": SPA_CARD_IDS.GENTLE_TOUCH_RITUAL,
  "SPA3": SPA_CARD_IDS.DEEP_RENEWAL_RITUAL,
  
  // Herbal packages
  "SPA_HC_1": SPA_CARD_IDS.SILKY_HERBAL_COMPRESS_RITUAL,
  "SPA_HC_2": SPA_CARD_IDS.THAI_HERBAL_COMPRESS_RITUAL,
  "SPA_HC_3": SPA_CARD_IDS.AROMA_STONE_HARMONY_RITUAL,
  
  // Zone only
  "SPA_ZONE_ONLY": SPA_CARD_IDS.SPA_ZONE,
  
  // Couple packages
  "ROMANTIC_COUPLE": SPA_CARD_IDS.ROMANTIC_COUPLE_PACKAGE,
  "ROMANTIC_PEELING": SPA_CARD_IDS.ROMANTIC_PEELING_COUPLE_PACKAGE,
};

export default SPA_CARD_IDS;
