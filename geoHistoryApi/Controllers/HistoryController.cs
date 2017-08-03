using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using geoHistoryApi.Repository;
using Microsoft.Extensions.Configuration;

namespace geoHistoryApi.Controllers
{
    [Route("api/[controller]")]
    public class HistoryController : Controller
    {
        private readonly HistoryRepository historyRepository;
        private readonly SectionRepository sectionRepository;

        public HistoryController(IConfiguration configuration)
        {
            historyRepository = new HistoryRepository(configuration);
            sectionRepository = new SectionRepository(configuration);
        }

        // GET api/history
        [HttpGet]
        public IEnumerable<Models.History> Get()
        {
            return historyRepository.FindAll();
        }

        // GET api/values/5
        [HttpGet("{user}")]
        public IEnumerable<Models.History> Get(string user)
        {
            return historyRepository.FindByUser(user);
        }

        // GET api/values/5
        [HttpGet("{user}/{history}")]
        public IEnumerable<Models.Section> GetHistory(string user, string history)
        {
           return sectionRepository.FindByHistory(user, history);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}