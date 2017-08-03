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
    public class HistoryRepository : IRepository<History>
    {
        private string connectionString;
        public HistoryRepository(IConfiguration configuration)
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

        public void Add(History item)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                dbConnection.Execute("INSERT INTO histories (username,historyname,createdate, watches, active, classlayout) VALUES(@Username,@HistoryName,@CreateDate,@Watches,@Active,@ClassLayout)", item);
            }
        }

        public IEnumerable<History> FindAll()
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                return dbConnection.Query<History>("SELECT * FROM histories");
            }
        }

        public History FindByID(int id)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                return dbConnection.Query<History>("SELECT * FROM histories WHERE id = @Id", new { Id = id }).FirstOrDefault();
            }
        }

        public IEnumerable<History> FindByUser(string username)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                return dbConnection.Query<History>("select * from histories where username like @Username", new { UserName = username });
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
    }
}
