using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Repositories;
using server.Services;
using server.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Next.js port
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Required for cookies/refresh token
    });
});

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySQL"),
        ServerVersion.AutoDetect(builder.Configuration
        .GetConnectionString("MySQL"))
    ));

builder.Services.AddScoped<IUserRepository, UserService>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRecordService>();
builder.Services.AddScoped<INotificationRepository, NotificationService>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<IMessageBusClient, MessageBusClient>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHostedService<EmailWorker>();
builder.Services.AddHostedService<NotificationWorker>();

// configure JWT Bearer Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var secretKey = builder.Configuration["JWT:Key"]
            ?? throw new InvalidOperationException("JWT:Key is not configured");
        var issuer = builder.Configuration["JWT:Issuer"]
            ?? throw new InvalidOperationException("JWT:Issuer is not configured");
        var audience = builder.Configuration["JWT:Audience"]
            ?? throw new InvalidOperationException("JWT:Audience is not configured");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey)),

            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            },
            OnTokenValidated = async context =>
            {
                var jti = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
                if (string.IsNullOrEmpty(jti))
                {
                    context.Fail("Missing JTI claim in token");
                    return;
                }

                var db = context.HttpContext.RequestServices.GetRequiredService<DataContext>();

                var refreshToken = await db.RefreshTokenRecords
                    .FirstOrDefaultAsync(rt => rt.AccessTokenJti == jti);

                if (refreshToken != null && !refreshToken.IsActive)
                {
                    context.Fail("Token has been revoked or expired");
                    return;
                }
            }
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowNextJS");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();

