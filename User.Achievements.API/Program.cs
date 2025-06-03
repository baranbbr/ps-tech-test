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

// Add response caching with options
builder.Services.AddResponseCaching(options =>
{
    options.MaximumBodySize = 1024; // 1KB - adjust based on your response size
    options.UseCaseSensitivePaths = false;
});

// Add memory cache for both response caching and in-memory caching in services
builder.Services.AddMemoryCache();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
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

app.UseAuthorization();

app.MapControllers();

app.Run();
