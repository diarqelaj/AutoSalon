using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using AutoSalonAPI.Data;
using DotNetEnv;

static void LoadEnvFromFile(string path)
{
    if (File.Exists(path)) Env.Load(path);
}

var builder = WebApplication.CreateBuilder(args);

// load .env
var envPath = Path.Combine(builder.Environment.ContentRootPath, ".env");
LoadEnvFromFile(envPath);

// sql env
string host  = Environment.GetEnvironmentVariable("SQL_HOST")        ?? "";
string db    = Environment.GetEnvironmentVariable("SQL_DB")          ?? "";
string user  = Environment.GetEnvironmentVariable("SQL_USER")        ?? "";
string pass  = Environment.GetEnvironmentVariable("SQL_PASSWORD")    ?? "";
bool encrypt = (Environment.GetEnvironmentVariable("SQL_ENCRYPT")    ?? "true").Equals("true", StringComparison.OrdinalIgnoreCase);
bool trust   = (Environment.GetEnvironmentVariable("SQL_TRUST_CERT") ?? "true").Equals("true", StringComparison.OrdinalIgnoreCase);

// build cs
var csb = new SqlConnectionStringBuilder {
    DataSource = host, InitialCatalog = db, UserID = user, Password = pass,
    IntegratedSecurity = false, MultipleActiveResultSets = true,
    Encrypt = encrypt, TrustServerCertificate = trust
};
string connectionString = csb.ToString();
builder.Configuration["ConnectionStrings:CRUDCS"] = connectionString;

// --- CORS: allow your frontend origin ---
var frontendOrigin = Environment.GetEnvironmentVariable("FRONTEND_ORIGIN") ?? "http://localhost:3000";
const string CorsPolicyName = "_frontend";

builder.Services.AddCors(opt =>
{
    opt.AddPolicy(CorsPolicyName, p =>
        p.WithOrigins(frontendOrigin)     // must match exactly (scheme + host + port)
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials());            // if you use cookies/Authorization header
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(connectionString));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// order matters: CORS should be before auth/endpoint execution
app.UseCors(CorsPolicyName);

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
