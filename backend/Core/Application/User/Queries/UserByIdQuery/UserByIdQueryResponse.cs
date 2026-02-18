
using System;

namespace Application.User.Queries.UserByIdQuery
{
    public class UserByIdQueryResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Profile { get; set; }
        public DateTime createdAt { get; set; }
    }
}
