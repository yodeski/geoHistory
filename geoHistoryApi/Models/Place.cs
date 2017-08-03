using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace geoHistoryApi.Models
{
    public class Place: BaseEntity
    {
        public long PlaceId { get; set; }
        public long SectionId { get; set; }
        public string PlaceName { get; set; }
        public string PlaceText { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public short PlaceOrder { get; set; }
        public short Zoom { get; set; }
        public short Bearing { get; set; }
        public short Pitch { get; set; }
    }
}
