using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Task01.Middlewares
{
    public class standardResponse
    {
        private readonly RequestDelegate _next;

        public standardResponse(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var originalBodyStream = context.Response.Body;

            using var memoryStream = new MemoryStream();
            context.Response.Body = memoryStream;

            try
            {
                await _next(context);

                memoryStream.Seek(0, SeekOrigin.Begin);
                var bodyText = await new StreamReader(memoryStream).ReadToEndAsync(); //string output

                memoryStream.Seek(0, SeekOrigin.Begin);
                context.Response.Body = originalBodyStream;

                var responseObject = new
                {
                    statusCode = context.Response.StatusCode,
                    message = GetMessage(context.Response.StatusCode), // hardcoded message assigner 
                    data = TryParseJson(bodyText) // The message passed in badrequest objects, like NotFound()
                };

                var wrappedJson = JsonSerializer.Serialize(responseObject);
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(wrappedJson);
            }
            catch (Exception ex)
            {
                context.Response.Body = originalBodyStream;
                context.Response.StatusCode = 500;
                var errorResponse = new
                {
                    statusCode = 500,
                    message = "Unhandled server error",
                    error = ex.Message  // The default error messages of exceptions 
                };
                var errorJson = JsonSerializer.Serialize(errorResponse);
                await context.Response.WriteAsync(errorJson);
            }
        }

        private object? TryParseJson(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return null;

            try
            {
                return JsonSerializer.Deserialize<object>(raw);
            }
            catch
            {
                return raw; 
            }
        }
        public string GetMessage(int errorCode)
        {
            return errorCode switch
            {
                400 => "Bad Request",
                401 => "Unauthorized",
                403 => "Forbidden",
                404 => "Not Found",
                500 => "Internal Server Error",
                200 => "Request Serviced Successfully",
                201 => "Creation Successful",
                _ => "Unknown Error "
            };
        }
    }
}
