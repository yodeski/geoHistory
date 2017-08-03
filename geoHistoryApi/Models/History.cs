using System;
using System.ComponentModel.DataAnnotations;

namespace geoHistoryApi.Models
{
    public class History : BaseEntity
    {
        [Key]
        public long HistoryId { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string HistoryName { get; set; }

        [Required]

        public DateTime CreateDate { get; set; }


        public int Watches { get; set; }

        public bool Active { get; set; }

        public string ClassLayout { get; set; }
    }
}
