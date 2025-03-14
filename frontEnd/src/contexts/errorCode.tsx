import { ErrorCodesI } from "@/models/errorCode";

const errorCodes: ErrorCodesI = {
  ERR_BAD_REQUEST: {
    number: 400,
    friendlyMessage: "Oops! Something went wrong with your request. Please check the information you entered and try again."
  },
  ERR_UNAUTHORIZED: {
    number: 401,
    friendlyMessage: "You need to log in to access this page. Please sign in and try again."
  },
  ERR_FORBIDDEN: {
    number: 403,
    friendlyMessage: "Sorry, you don’t have permission to access this page. If you think this is a mistake, contact support."
  },
  ERR_NOT_FOUND: {
    number: 404,
    friendlyMessage: "We couldn’t find the page you’re looking for. It might have been moved or deleted. Try checking the URL or go back to the homepage."
  },
  ERR_TIMEOUT: {
    number: 408,
    friendlyMessage: "The request took too long to process. Please check your internet connection and try again."
  },
  ERR_TOO_MANY_REQUESTS: {
    number: 429,
    friendlyMessage: "You’ve made too many requests recently. Please wait a moment and try again."
  },
  ERR_INTERNAL_SERVER: {
    number: 500,
    friendlyMessage: "Something went wrong on our end. Don’t worry, our team is working to fix it. Please try again later."
  },
  ERR_BAD_GATEWAY: {
    number: 502,
    friendlyMessage: "The server encountered a temporary issue. Please refresh the page or try again in a few minutes."
  },
  ERR_SERVICE_UNAVAILABLE: {
    number: 503,
    friendlyMessage: "We’re temporarily down for maintenance. Please check back soon!"
  },
  ERR_GATEWAY_TIMEOUT: {
    number: 504,
    friendlyMessage: "The server took too long to respond. Please check your internet connection and try again."
  },
  ERR_NETWORK: {
    number: null,
    friendlyMessage: "We’re having trouble connecting to the server. Please check your internet connection and try again or contact support."
  },
  ERR_CONNECTION_REFUSED: {
    number: null,
    friendlyMessage: "The server refused the connection. Please try again later or contact support."
  },
  ERR_CONNECTION_TIMEOUT: {
    number: null,
    friendlyMessage: "The connection timed out. Please check your internet connection and try again."
  },
  ERR_SSL_PROTOCOL_ERROR: {
    number: null,
    friendlyMessage: "There’s an issue with the secure connection. Please ensure your browser is up to date or try accessing the site later."
  },
  ERR_NAME_NOT_RESOLVED: {
    number: null,
    friendlyMessage: "We couldn’t find the website you’re looking for. Please check the URL or try again later."
  },
  ERR_DNS_PROBE_FINISHED_NXDOMAIN: {
    number: null,
    friendlyMessage: "The website you’re trying to reach doesn’t exist. Double-check the URL or go back to the homepage."
  },
  ERR_CACHE_MISS: {
    number: null,
    friendlyMessage: "Your browser couldn’t load the cached version of this page. Please refresh the page or clear your cache."
  },
  ERR_EMPTY_RESPONSE: {
    number: null,
    friendlyMessage: "The server sent an empty response. Please try refreshing the page or contact support."
  },
  ERR_TOO_MANY_REDIRECTS: {
    number: null,
    friendlyMessage: "The page is stuck in a loop of redirects. Please clear your cookies or try accessing the page later."
  },
  ERR_BLOCKED_BY_CLIENT: {
    number: null,
    friendlyMessage: "Your browser or an extension blocked the request. Please check your settings and try again."
  },
  ERR_FILE_NOT_FOUND: {
    number: null,
    friendlyMessage: "The file you’re looking for couldn’t be found. It might have been moved or deleted."
  },
  ERR_INSECURE_RESPONSE: {
    number: null,
    friendlyMessage: "The connection to this website is not secure. Please proceed with caution or contact the website owner."
  }
};

export default errorCodes;