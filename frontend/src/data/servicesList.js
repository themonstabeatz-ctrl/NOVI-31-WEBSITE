// Complete list of all services with translation keys
export const massageServices = [
  { key: 'traditionalThaiMassage', basePrice: 4400 },
  { key: 'aromaTherapyService', basePrice: 4400 },
  { key: 'hotStoneMassage', basePrice: 3000 },
  { key: 'royalThaiMassage', basePrice: 3000 },
  { key: 'footMassageService', basePrice: 3000 },
  { key: 'couplesMassage', basePrice: 3000 },
  { key: 'sportsMassageService', basePrice: 3000 },
  { key: 'shiatsuMassageService', basePrice: 3000 },
  { key: 'reflexologyService', basePrice: 3000 },
  { key: 'backNeckMassage', basePrice: 3000 },
  { key: 'antiStressMassageService', basePrice: 3000 },
  { key: 'prenatalMassageService', basePrice: 3000 },
  { key: 'deepTissueMassageService', basePrice: 3000 },
  { key: 'bambooMassageService', basePrice: 3000 },
  { key: 'lymphaticDrainage', basePrice: 3000 }
];

export const spaServices = [
  { key: 'facialTreatmentService', basePrice: 3000 },
  { key: 'bodyWrapService', basePrice: 3000 },
  { key: 'goldenFacialService', basePrice: 3000 },
  { key: 'steamBathService', basePrice: 3000 },
  { key: 'royalSpaService', basePrice: 3000 },
  { key: 'hydratingTreatment', basePrice: 3000 },
  { key: 'detoxTreatment', basePrice: 3000 },
  { key: 'bodyScrubService', basePrice: 3000 },
  { key: 'anticelluliteTreatment', basePrice: 3000 },
  { key: 'collagenFacial', basePrice: 3000 },
  { key: 'vitaminCFacial', basePrice: 3000 },
  { key: 'combinedSpaDay', basePrice: 3000 },
  { key: 'chocolateWrap', basePrice: 3000 }
];

// Serbian service names used by booking system (MUST MATCH serviceMapping keys EXACTLY!)
export const bookingSystemNames = {
  // Massages
  'traditionalThaiMassage': 'Tradicionalna tajlandska masaža',
  'aromaTherapyService': 'Aroma terapija',
  'hotStoneMassage': 'Masaža toplim uljem',
  'royalThaiMassage': 'Glava, vrat, ramena i leđa',
  'footMassageService': 'Masaža stopala',
  'couplesMassage': 'Partnerska masaža',
  'sportsMassageService': 'Sportska masaža',
  'shiatsuMassageService': 'Shiatsu masaža',
  'reflexologyService': 'Refleksologija',
  'backNeckMassage': 'Masaža leđa i vrata',
  'antiStressMassageService': 'Antistres masaža',
  'prenatalMassageService': 'Prenatalna masaža',
  'deepTissueMassageService': 'Masaža dubokih tkiva',
  'bambooMassageService': 'Bamboo masaža',
  'lymphaticDrainage': 'Limfna drenaža',
  
  // Spa Treatments
  'facialTreatmentService': 'Tretman lica',
  'bodyWrapService': 'Body wrap',
  'goldenFacialService': 'Zlatni tretman lica',
  'steamBathService': 'Parno kupatilo',
  'royalSpaService': 'Kraljevski spa paket',
  'hydratingTreatment': 'Hidratantni tretman',
  'detoxTreatment': 'Detox tretman',
  'bodyScrubService': 'Piling tela',
  'anticelluliteTreatment': 'Anticelulit tretman',
  'collagenFacial': 'Kolageni tretman lica',
  'vitaminCFacial': 'Vitamin C tretman lica',
  'combinedSpaDay': 'Kombinovani spa dan',
  'chocolateWrap': 'Čokoladni wrap'
};

export const durations = [
  { minutes: 60, price: 3000 },
  { minutes: 90, price: 4000 },
  { minutes: 120, price: 5000 }
];
