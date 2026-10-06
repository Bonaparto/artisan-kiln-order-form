/** Strips everything but 0–9: "4242 4242" → "42424242". */
export const digitsOnly = (value: string): string => value.replace(/\D/g, '');
