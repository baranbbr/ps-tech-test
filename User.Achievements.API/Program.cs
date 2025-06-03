using User.Achievements.API.Clients;
using User.Achievements.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<IUsersService, UsersService>();
builder.Services.AddHttpClient<IUserApiClient, UserApiClient>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration.GetValue<string>("UsersApiBaseUrl")!);
});

builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

builder.Services.AddControllers();
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!;
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod();
        }
    );
});

builder.Services.AddResponseCaching(options =>
{
    options.MaximumBodySize = 1024; // 1 KB
    options.UseCaseSensitivePaths = false;
});

builder.Services.AddMemoryCache();

// Add CORS services
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!;
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        builder =>
        {
            builder.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod();
        }
    );
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowFrontend");

// Enable response caching
app.UseResponseCaching();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
