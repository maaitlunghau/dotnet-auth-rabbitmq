using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Repositories;
using server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("ConnectedMySQL"),
        ServerVersion.AutoDetect(builder.Configuration
        .GetConnectionString("ConnectedMySQL"))
    ));

builder.Services.AddScoped<IUserRepository, UserService>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRecordService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    //
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

