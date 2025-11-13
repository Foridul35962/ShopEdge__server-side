const errorHandler = (err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    return res.status(statusCode)
    .json({
        success: err.success || false,
        message: err.message || 'Interner server error',
        error: err.error || [],
        data : err.data || null
    })
}

export default errorHandler