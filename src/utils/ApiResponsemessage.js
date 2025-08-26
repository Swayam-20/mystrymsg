class ApiResponsemessage {
    constructor( success , message , statusCode, data ) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
}

export default ApiResponsemessage;