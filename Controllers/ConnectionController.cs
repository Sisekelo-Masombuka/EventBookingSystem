using Microsoft.AspNetCore.Mvc;

namespace EventBookingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConnectionController : ControllerBase
    {
        private readonly ILogger<ConnectionController> _logger;

        public ConnectionController(ILogger<ConnectionController> logger)
        {
            _logger = logger;
        }

        [HttpGet("status")]
        public IActionResult GetConnectionStatus()
        {
            return Ok(new
            {
                status = "Connected",
                message = "Frontend and Backend are successfully connected!",
                timestamp = DateTime.UtcNow,
                backend = "ASP.NET Core Web API",
                frontend = "React Application"
            });
        }

        [HttpGet("test")]
        public IActionResult TestConnection()
        {
            return Ok(new
            {
                success = true,
                message = "Connection test successful",
                data = new
                {
                    serverTime = DateTime.UtcNow,
                    environment = "Development",
                    version = "1.0.0"
                }
            });
        }
    }
}

