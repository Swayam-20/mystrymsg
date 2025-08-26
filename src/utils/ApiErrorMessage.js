class ApiErrorMessage extends Error {
    constructor({ statusCode = 500, message = "An error occurred", data = null } = {}) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.success = false;
    }
}

export default ApiErrorMessage;