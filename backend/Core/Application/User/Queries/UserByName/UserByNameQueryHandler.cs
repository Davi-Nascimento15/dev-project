
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User.Queries.UserByNameQuery
{
    public class UserByNameQueryHandler : IRequestHandler<UserByNameQueryRequest, List<UserByNameQueryResponse>>
    {
        private readonly IClientControlContext _context;

        public UserByNameQueryHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<List<UserByNameQueryResponse>> Handle(UserByNameQueryRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Username.ToLower().Contains(Extensions.RemoveDiacritics(request.Username.ToLower())))
                    .Select(u => new UserByNameQueryResponse
                    {
                        Id = u.Id,
                        Username = u.Username,
                        createdAt = u.CreatedAt,
                        Profile = u.Profile.ToString()
                    })
                    .ToListAsync();


                return user;
            }
            catch
            {
                return new();
            }
        }
    }
}
