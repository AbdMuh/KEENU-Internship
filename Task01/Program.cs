using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer; // after installing package  
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Diagnostics;
using Task01.Data;
using UserApi.Services;

var key = "ThisIsASecretKey123!ThisIsASecretKey123!";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserService,UserService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
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
});


app.MapControllers();

app.Run();
