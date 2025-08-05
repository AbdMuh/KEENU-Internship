using Microsoft.AspNetCore.Authentication.JwtBearer; // after installing package  
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog.Enrichers.WithCaller;
using Serilog;
using Serilog.Events;
using System.Diagnostics;
using System.Text;
using Task01.Data;
using Task01.Middlewares;
using Task01.Model;
using UserApi.Services;
using Serilog.Exceptions;
using Task01.Service;

var builder = WebApplication.CreateBuilder(args);



Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration) // <-- key line
    .Enrich.FromLogContext()
    .Enrich.WithExceptionDetails()
    .Enrich.WithEnvironmentName()
    .Enrich.WithMachineName()
    .Enrich.WithProcessId()
    .Enrich.WithProcessName()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt")); //binding Jwt Section to JwtSettings class

builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:3001") // Added 5173 for Vite
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); //- it's okay for the frontend to send cookies, authorization headers
    }); 
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddScoped<IBillService, BillService>();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]); //converts string to byte array for the key creation

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // how to validate tokens upon receiving requests
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // how to respond when authentication fails
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key) // actual key to validate the token
    };
});


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanViewUsers", policy =>
        policy.RequireClaim("permissions", "view_users"));

    options.AddPolicy("CanEditUsers", policy =>
        policy.RequireClaim("permissions", "edit_users"));
});


builder.Services.AddResponseCaching();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseMiddleware<RequestLogging>();

//app.UseMiddleware<ErrorHandlingMiddleware>();

//Must be before UseAuthentication and UseAuthorization
app.UseCors("ReactApp");

app.UseResponseCaching();
app.UseMiddleware<SingleSessionManager>();
app.UseAuthentication(); //comes before authorization
app.UseAuthorization();
app.UseStaticFiles();

//app.Use(async (ctx, next) =>
//{
//    Console.WriteLine("A - before");
//    await next(); // go to next middleware
//    Console.WriteLine("A - after");
//});

//app.Use(async (ctx, next) => //ctx represents current request information (allowing us to modify) 
//// next, represents next middleware in the pipeline 
//{
//    Console.WriteLine("B - before");
//    await next();
//    Console.WriteLine("B - after");
//});

app.Use(async (ctx, next) =>
{
    var timer = Stopwatch.StartNew();
    await next();
    timer.Stop();
    Console.WriteLine($"Request took {timer.ElapsedMilliseconds} ms");
    Console.WriteLine($"Response status Code: {ctx.Response.StatusCode}");
});

app.UseMiddleware<standardResponse>();
app.MapControllers();

app.Run();