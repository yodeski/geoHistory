using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace geoHistoryApi.Models
{
    public class Section : BaseEntity
    {
        [Key]
        public long SectionId { get; set; }

        [Required]
        public long HistoryId { get; set; }

        [Required]
        public string ClassLayout { get; set; }

        [Required]
        public string SectionText { get; set; }

        [Required]
        public string SectionImage { get; set; }

        public int SectionOrder { get; set; }

        public IList<Place> Places { get; set; }

    }
}
