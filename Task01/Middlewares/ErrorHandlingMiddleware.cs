using System.Text.Json;

namespace Task01.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception e)
            {
                int statusCode;
                string message;

                if (e is KeyNotFoundException)
                {
                    statusCode = 404;
                    message = "Server couldn't find the requested resource.";
                    _logger.LogError(e, message);
                }
                else
                {
                    statusCode = 500;
                    message = "An error occurred while servicing the request.";
                    _logger.LogError(e, message);
                }

                context.Response.StatusCode = statusCode; 
                context.Response.ContentType = "application/json";

                var errorResponse = new
                {
                    StatusCode = statusCode,
                    Message = message
                };

                var json = JsonSerializer.Serialize(errorResponse);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
