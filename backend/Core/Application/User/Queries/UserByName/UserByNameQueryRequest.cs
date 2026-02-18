
using MediatR;
using System;
using System.Collections.Generic;

namespace Application.User.Queries.UserByNameQuery
{
    public class UserByNameQueryRequest : IRequest<List<UserByNameQueryResponse>>
    {
        public string  Username { get; set; }
    }
}
