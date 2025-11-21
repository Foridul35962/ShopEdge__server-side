class ApiResponse{
    constructor(statusCode, data = [], messege = 'worked successfully'){
        this.statusCode = statusCode,
        this.messege = messege,
        this.data = data,
        this.success = statusCode < 400
    }
}

export default ApiResponse