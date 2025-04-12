export const ERROR_MESSAGE = "error_message";

export const errorMessageAction = (errorMessageData: {message: String | null, status: String | null}) => ({type: ERROR_MESSAGE, payload: errorMessageData});