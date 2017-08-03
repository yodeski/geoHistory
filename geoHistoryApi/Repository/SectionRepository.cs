using Dapper;
using geoHistoryApi.Models;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace geoHistoryApi.Repository
{
    public class SectionRepository : IRepository<Section>
    {
        private string connectionString;
        public SectionRepository(IConfiguration configuration)
        {
            connectionString = configuration.GetValue<string>("DBInfo:ConnectionString");
        }

        internal IDbConnection Connection
        {
            get
            {
                return new NpgsqlConnection(connectionString);
            }
        }

        public void Add(Section item)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                dbConnection.Execute("INSERT INTO histories (username,historyname,createdate, watches, active, classlayout) VALUES(@Username,@HistoryName,@CreateDate,@Watches,@Active,@ClassLayout)", item);
            }
        }

        public IEnumerable<Section> FindAll()
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                return dbConnection.Query<Section>("SELECT * FROM histories");
            }
        }

        public Section FindByID(int id)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                return dbConnection.Query<Section>("SELECT * FROM histories WHERE id = @Id", new { Id = id }).FirstOrDefault();
            }
        }

        public IEnumerable<Section> FindByHistory(string username, string history)
        {
            var sql = @"SELECT * FROM sections s 
                        inner join histories h on s.historyid=h.historyid  
                        WHERE historyname like @HistoryName and username like @UserName;
                        
                       SELECT p.* FROM places p 
                        inner join sections s on s.sectionid=p.sectionid
                       inner join histories h on s.historyid=h.historyid 
                       WHERE historyname like @HistoryName and username like @UserName;";

            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                var mapper = dbConnection.QueryMultiple(sql, new { HistoryName = history, UserName = username });
                var sections = mapper.Read<Section>().ToDictionary(k => k.SectionId, v => v);
                var places = mapper.Read<Place>().ToList();
                foreach (var place in places.GroupBy(g => g.SectionId))
                {
                    sections[place.Key].Places = place.OrderBy(o => o.PlaceId).ToList();
                }
                return sections.Values.OrderBy(o => o.SectionId).ToList();
            }
        }

        public IEnumerable<History> FindByName(string username, string history)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                return dbConnection.Query<History>("select * from histories where username like @Username and historyname like @HistoryName", new { UserName = username, HistoryName = history });
            }
        }

        public void Remove(int id)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                dbConnection.Execute("DELETE FROM histories WHERE Id=@Id", new { Id = id });
            }
        }

        public void Update(History item)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                dbConnection.Query("UPDATE histories SET historyname = @HistoryName,  active  = @Active, classlayout= @ClassLayout WHERE id = @Id", item);
            }
        }

        public void Update(Section item)
        {
            throw new NotImplementedException();
        }
    }
}
