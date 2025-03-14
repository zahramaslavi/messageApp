interface ErrorDetailsI {
  number: number | null; // HTTP status code or null for non-HTTP errors
  friendlyMessage: string; // User-friendly error message
}
  
export interface ErrorCodesI {
  [key: string]: ErrorDetailsI; // Dynamic keys for error codes
}
  