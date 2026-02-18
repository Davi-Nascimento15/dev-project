
using System;

namespace Application.User.Queries.AllUsersQuery
{
    public class AllUsersQueryResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Profile { get; set; }
        public DateTime createdAt { get; set; }
    }
}
