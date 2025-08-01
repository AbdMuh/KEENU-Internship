using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Task01.Data;

namespace Task01.Middlewares
{
    public class SingleSessionManager
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _scopeFactory;  

        public SingleSessionManager(RequestDelegate next, IServiceScopeFactory scopeFactory)
        {
            _next = next;
            _scopeFactory = scopeFactory; 
        }

        public async Task Invoke(HttpContext httpContext)
        {
            if (httpContext.Request.Path.StartsWithSegments("/Auth/login") || (httpContext.Request.Path.StartsWithSegments("/Users")
                && httpContext.Request.Method == "POST"))
            {
                await _next(httpContext);  // Skip the middleware for the login endpoint
                return;
            }

            var token = httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            Console.WriteLine("Token Extracted: ", token);

            if (string.IsNullOrEmpty(token))
            {
                httpContext.Response.StatusCode = 401;  
                return;
            }

            Console.WriteLine("About to create scope");


            using (var scope = _scopeFactory.CreateScope())  
            {
                var _context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

                var userToken = await _context.UserTokens
                    .FirstOrDefaultAsync(t => t.Token == token && t.IsActive && t.Expiration > DateTime.Now);

                Console.WriteLine("UserToken: ", userToken);

                if (userToken == null)
                {
                    Console.WriteLine("The userToken is Null");
                    httpContext.Response.StatusCode = 401;
                    await httpContext.Response.WriteAsync("Unauthorized");
                    return;
                }

                await _next(httpContext);  
            }
        }
    }
}
