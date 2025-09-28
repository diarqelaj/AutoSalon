namespace AutoSalonAPI.DTOs
{
    public record RegisterDto(string Email, string Password, string Username, string? FullName, bool? MarketingOptIn);
    public record LoginDto(string Email, string Password);
    public record AuthResultDto(string AccessToken, DateTime ExpiresAt, string? RefreshToken, DateTime? RefreshTokenExpiresAt);
    public record RefreshDto(string RefreshToken);
    
}
