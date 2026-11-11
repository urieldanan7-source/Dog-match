/** Working title. The real product name is still open, so it lives in one place. */
export const APP_NAME = 'איזה כלב מתאים לי'
/** Where the "coming soon" signup posts to. Empty until a mailing service is chosen. */
export const SIGNUP_ENDPOINT: string = import.meta.env.VITE_SIGNUP_ENDPOINT ?? ''
export const A11Y_CONTACT = {
  name: import.meta.env.VITE_A11Y_NAME ?? '',
  email: import.meta.env.VITE_A11Y_EMAIL ?? '',
  phone: import.meta.env.VITE_A11Y_PHONE ?? '',
}
