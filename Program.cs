using EventBookingSystem.Data;
using EventBookingSystem.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


//
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add PDF Service
builder.Services.AddScoped<ITicketPdfService, TicketPdfService>();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply EF Core migrations and ensure default admin credentials
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var db = services.GetRequiredService<ApplicationDbContext>();
        // Apply any pending migrations
        db.Database.Migrate();

        // Ensure default admin exists with the expected password and role
        var adminEmail = "admin@mzansimomentshub.com";
        var admin = await db.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
        var desiredHash = BCrypt.Net.BCrypt.HashPassword("Admin@123!");
        if (admin != null)
        {
            admin.PasswordHash = desiredHash;
            admin.Role = "Admin";
            await db.SaveChangesAsync();
        }

        // Ensure Gender column can store values like "Prefer not to say"
        // (widen to NVARCHAR(30) if currently smaller)
        var widenGenderSql = @"
IF EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Gender'
)
BEGIN
    DECLARE @currentMaxLen INT;
    SELECT @currentMaxLen = CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Gender';

    IF (@currentMaxLen IS NOT NULL AND @currentMaxLen < 30)
    BEGIN
        ALTER TABLE [Users] ALTER COLUMN [Gender] NVARCHAR(30) NOT NULL;
    END
END";

        await db.Database.ExecuteSqlRawAsync(widenGenderSql);

        // Relax optional fields to be nullable to avoid registration failures
        var makeOptionalFieldsNullableSql = @"
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'PhoneNumber')
    ALTER TABLE [Users] ALTER COLUMN [PhoneNumber] NVARCHAR(20) NULL;
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'StreetAddress')
    ALTER TABLE [Users] ALTER COLUMN [StreetAddress] NVARCHAR(255) NULL;
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'City')
    ALTER TABLE [Users] ALTER COLUMN [City] NVARCHAR(100) NULL;
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'PostalCode')
    ALTER TABLE [Users] ALTER COLUMN [PostalCode] NVARCHAR(20) NULL;
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Country')
    ALTER TABLE [Users] ALTER COLUMN [Country] NVARCHAR(100) NULL;
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Gender')
    ALTER TABLE [Users] ALTER COLUMN [Gender] NVARCHAR(30) NULL;";

        await db.Database.ExecuteSqlRawAsync(makeOptionalFieldsNullableSql);
    }
    catch (Exception)
    {
        // Swallow startup seeding exceptions to not block app start; they will surface in logs
    }
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowReactApp");

// Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();
//Cuba2
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
//Cuba1
app.MapFallbackToFile("index.html");

app.Run();
