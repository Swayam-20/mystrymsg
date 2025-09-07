export interface ApiError {
    success: boolean;
    message: string;
    statusCode?: number; // Optional field for HTTP status code
    error?: string; // Optional field for error details
    }