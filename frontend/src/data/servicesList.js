// Complete list of all services with translation keys
export const massageServices = [
  { key: 'traditionalThaiMassage', basePrice: 3000 },
  { key: 'aromaTherapyService', basePrice: 3000 },
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
  { key: 'aromatherapySpa', basePrice: 3000 },
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

// Mapping from translated service names back to booking system names
export const getBookingSystemName = (translatedName, translate) => {
  // Map of translation keys to booking system service names
  const serviceMap = {
    'traditionalThaiMassage': 'Tradicionalna tajlandska masaža',
    'aromaTherapyService': 'Aroma terapija',
    'hotStoneMassage': 'Masaža vrućim kamenjem',
    'royalThaiMassage': 'Kraljevska tajlandska masaža',
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
    'facialTreatmentService': 'Tretman lica',
    'bodyWrapService': 'Body wrap',
    'goldenFacialService': 'Zlatni tretman lica',
    'aromatherapySpa': 'Aromaterapija',
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
  
  // Find which key matches the translated name
  for (const [key, bookingName] of Object.entries(serviceMap)) {
    if (translate(key) === translatedName.split(' - ')[0]) {
      return bookingName;
    }
  }
  
  // If no match found, return as is (for backward compatibility)
  return translatedName.split(' - ')[0];
};

export const durations = [
  { minutes: 60, price: 3000 },
  { minutes: 90, price: 4000 },
  { minutes: 120, price: 5000 }
];
