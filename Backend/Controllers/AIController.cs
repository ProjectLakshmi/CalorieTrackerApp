using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AIController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AIController(IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost("recommend")]
    public async Task<IActionResult> Recommend([FromBody] RecommendRequest request)
    {
        try
        {
            var apiKey = _config["Gemini:ApiKey"];
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

            var body = new
            {
                contents = new[]
                {
                new
                {
                    parts = new[]
                    {
                        new { text = request.Prompt }
                    }
                }
            }
            };

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, url);
            httpRequest.Content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(httpRequest);
            var json = await response.Content.ReadAsStringAsync();

            Console.WriteLine("Gemini raw response: " + json); // ← check Output window

            using var doc = JsonDocument.Parse(json);

            // ← Check if candidates exists first
            if (!doc.RootElement.TryGetProperty("candidates", out var candidates))
            {
                // Return the raw Gemini error so you can see it
                return StatusCode(500, new { error = "Gemini error", raw = json });
            }

            var text = candidates[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return Ok(new { text });
        }
        catch (Exception ex)
        {
            // ← This will show the exact error in the response
            return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
        }
    }
}

public class RecommendRequest
{
    public string Prompt { get; set; }
}