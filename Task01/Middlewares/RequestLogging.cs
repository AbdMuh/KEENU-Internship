using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Serilog.Context;
using System.Diagnostics;


namespace Task01.Middlewares
{
    public class RequestLogging
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLogging> _logger;

        public RequestLogging(RequestDelegate next, ILogger<RequestLogging> logger)
        {
            _next = next;
            _logger = logger;
        }

        public Task Invoke(HttpContext httpContext)
        {
            var requestId = Guid.NewGuid().ToString();
            httpContext.Items["RequestId"] = requestId;
            using (LogContext.PushProperty("RequestId", requestId))
            {
                try
                {


                    _logger.LogInformation("Handling request: {Method} {Path}",
                        httpContext.Request.Method,
                        httpContext.Request.Path);
                    _logger.LogInformation("Completed request {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while processing the request: {Method} {Path} with RequestId: {RequestId}",
                        httpContext.Request.Method,
                        httpContext.Request.Path,
                        requestId);
                    throw;
                }
                return _next(httpContext);
            }
        }
    }
}
