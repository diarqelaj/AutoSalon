using Microsoft.Data.SqlClient;          // <-- make sure this line ends with a semicolon
using Microsoft.EntityFrameworkCore;
using AutoSalonAPI.Data;
using DotNetEnv;

static void LoadEnvFromFile(string path)
{
    // If you prefer DotNetEnv only, you can just call Env.Load(path) and delete this helper.
    if (File.Exists(path))
    {
        Env.Load(path); // loads key=value into process env
    }
}

var builder = WebApplication.CreateBuilder(args);

// 1) Load .env from the content root (project folder)
var envPath = Path.Combine(builder.Environment.ContentRootPath, ".env");
LoadEnvFromFile(envPath);

// 2) Read env vars
string host  = Environment.GetEnvironmentVariable("SQL_HOST")        ?? "";
string db    = Environment.GetEnvironmentVariable("SQL_DB")          ?? "";
string user  = Environment.GetEnvironmentVariable("SQL_USER")        ?? "";
string pass  = Environment.GetEnvironmentVariable("SQL_PASSWORD")    ?? "";
bool encrypt = (Environment.GetEnvironmentVariable("SQL_ENCRYPT")    ?? "true")
                  .Equals("true", StringComparison.OrdinalIgnoreCase);
bool trust   = (Environment.GetEnvironmentVariable("SQL_TRUST_CERT") ?? "true")
                  .Equals("true", StringComparison.OrdinalIgnoreCase);

// 3) Build the connection string
var csb = new SqlConnectionStringBuilder
{
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

// Also expose it under the standard key if anything uses IConfiguration
builder.Configuration["ConnectionStrings:CRUDCS"] = connectionString;

// 4) Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(connectionString));

var app = builder.Build();

// 5) Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
