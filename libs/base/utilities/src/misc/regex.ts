/**
 * Regex pattern to find a phone number.
 */
export const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9()]*$/im;

/**
 * Regex pattern to find an email address.
 */
export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/im;
