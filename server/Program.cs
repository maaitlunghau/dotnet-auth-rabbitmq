using Microsoft.EntityFrameworkCore;
using server.Data;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("ConnectedMySQL"),
        ServerVersion.AutoDetect(builder.Configuration
        .GetConnectionString("ConnectedMySQL"))
    ));

var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    //
}

app.UseHttpsRedirection();


app.Run();

