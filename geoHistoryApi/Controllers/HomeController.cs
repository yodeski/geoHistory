using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace geoHistoryApi.Controllers
{
    [Route("[controller]")]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}