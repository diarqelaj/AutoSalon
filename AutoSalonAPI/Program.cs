using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using AutoSalonAPI.Data;
using DotNetEnv;

static void LoadEnvFromFile(string path)
{
    if (File.Exists(path)) Env.Load(path);
}

var builder = WebApplication.CreateBuilder(args);

// E ngarkojme .env
var envPath = Path.Combine(builder.Environment.ContentRootPath, ".env");
LoadEnvFromFile(envPath);


string host  = Environment.GetEnvironmentVariable("SQL_HOST")        ?? "";
string db    = Environment.GetEnvironmentVariable("SQL_DB")          ?? "";
string user  = Environment.GetEnvironmentVariable("SQL_USER")        ?? "";
string pass  = Environment.GetEnvironmentVariable("SQL_PASSWORD")    ?? "";
bool encrypt = (Environment.GetEnvironmentVariable("SQL_ENCRYPT")    ?? "true")
                .Equals("true", StringComparison.OrdinalIgnoreCase);
bool trust   = (Environment.GetEnvironmentVariable("SQL_TRUST_CERT") ?? "true")
                .Equals("true", StringComparison.OrdinalIgnoreCase);

var csb = new SqlConnectionStringBuilder {
    DataSource = host,
    InitialCatalog = db,
    UserID = user,
    Password = pass,
    IntegratedSecurity = false,
    MultipleActiveResultSets = true,
    Encrypt = encrypt,
    TrustServerCertificate = trust
};
string connectionString = csb.ToString();
builder.Configuration["ConnectionStrings:CRUDCS"] = connectionString;


var frontendOrigin = Environment.GetEnvironmentVariable("FRONTEND_ORIGIN") ?? "http://localhost:3000";
const string CorsPolicyName = "_frontend";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(CorsPolicyName, p =>
        p.WithOrigins(frontendOrigin)
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials());
});

string GetEnv(string key, string? fallback = null)
    => Environment.GetEnvironmentVariable(key) ?? fallback
       ?? throw new InvalidOperationException($"{key} not set");

string jwtIssuer  = Environment.GetEnvironmentVariable("JWT_ISSUER")   ?? "AutoSalonAPI";
string jwtAudience= Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "AutoSalonClient";
string jwtKeyStr  = GetEnv("JWT_KEY"); // preferon Base64

// Porovojm me Base64 perndryshe me UTF8
SymmetricSecurityKey MakeSigningKey(string raw)
{
    try
    {
        // gjuan error nqs nuk eshte Base64 valid
        var keyBytes = Convert.FromBase64String(raw);
        if (keyBytes.Length < 32)
            throw new InvalidOperationException("JWT_KEY base64 decoded is < 32 bytes. Use 32 bytes (256-bit).");
        return new SymmetricSecurityKey(keyBytes);
    }
    catch
    {
        var utf8 = Encoding.UTF8.GetBytes(raw);
        if (utf8.Length < 32)
            throw new InvalidOperationException("JWT_KEY UTF8 length is < 32 bytes. Provide a longer key or Base64 32-byte key.");
        return new SymmetricSecurityKey(utf8);
    }
}

var signingKey = MakeSigningKey(jwtKeyStr);


int accessMinutes   = int.TryParse(Environment.GetEnvironmentVariable("JWT_ACCESS_MIN"), out var am) ? am : 30;
int refreshDays     = int.TryParse(Environment.GetEnvironmentVariable("JWT_REFRESH_DAYS"), out var rd) ? rd : 7;
builder.Configuration["Jwt:Issuer"]             = jwtIssuer;
builder.Configuration["Jwt:Audience"]           = jwtAudience;
builder.Configuration["Jwt:AccessTokenMinutes"] = accessMinutes.ToString();
builder.Configuration["Jwt:RefreshTokenDays"]   = refreshDays.ToString();

// Serviset
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(connectionString));

// JWT-ja
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.RequireHttpsMetadata = true;
        opt.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.FromSeconds(15)
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AutoSalon API", Version = "v1" });
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter: Bearer {your JWT}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, new string[] {} }
    });
});

var app = builder.Build();

// 6) Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicyName);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
