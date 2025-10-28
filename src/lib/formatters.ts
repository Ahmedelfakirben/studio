/**
 * Utilidades de formateo para la aplicación ALY Gestion
 */

/**
 * Formatea un número como moneda en Dirhams Marroquíes (MAD)
 * @param amount - Cantidad a formatear
 * @returns String formateado como "1 234,56 DH"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea una fecha en formato francés
 * @param date - Fecha a formatear (string ISO o Date)
 * @returns String formateado como "28 octobre 2025"
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Formatea una fecha corta
 * @param date - Fecha a formatear (string ISO o Date)
 * @returns String formateado como "28/10/2025"
 */
export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR');
};
