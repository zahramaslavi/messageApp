import errorCodes from "../errorCode";

export const getFriendlyErrorData = (error: any) => {
    let message = "";
    let status = null;

    if (error?.response?.data?.error?.message) {
      message = error?.response?.data?.error?.message;
    } else if ( error.code && errorCodes[error.code] ) {
      message = errorCodes[error.code].friendlyMessage;
    } else {
      message = "Something went wrong - try again or contact support";
    }

    status = error.status;

    return {message, status};
  }