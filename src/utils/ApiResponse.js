class ApiResponse{
    constructor(statusCode, messege = 'worked successfully', data = []){
        this.statusCode = statusCode,
        this.messege = messege,
        this.data = data,
        this.success = statusCode < 400
    }
}

export default ApiResponse