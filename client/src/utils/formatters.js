/**
 * Utility functions for formatting values in the UI
 */

/**
 * Format numeric currency values to stylized currency strings
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - USD, EUR, GBP, or INR
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount = 0, currencyCode = 'USD') => {
  const currencyMap = {
    USD: { locale: 'en-US', symbol: '$' },
    EUR: { locale: 'de-DE', symbol: '€' },
    GBP: { locale: 'en-GB', symbol: '£' },
    INR: { locale: 'en-IN', symbol: '₹' },
  };

  const { locale, symbol } = currencyMap[currencyCode] || currencyMap['USD'];

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    return `${symbol}${Number(amount).toFixed(2)}`;
  }
};

/**
 * Format ISO dates into localized reader-friendly format
 * @param {string} dateString - The ISO date string
 * @returns {string} Formatted date (e.g., Oct 24, 2023)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
