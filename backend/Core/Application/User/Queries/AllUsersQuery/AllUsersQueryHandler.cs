
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User.Queries.AllUsersQuery
{
    public class AllUsersQueryHandler : IRequestHandler<AllUsersQueryRequest, IEnumerable<AllUsersQueryResponse>>
    {
        private readonly IClientControlContext _context;

        public AllUsersQueryHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AllUsersQueryResponse>> Handle(AllUsersQueryRequest request, CancellationToken cancellationToken)
        {
            var users = await _context.Users
                .Select(u => new AllUsersQueryResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    createdAt = u.CreatedAt,
                    Profile = u.Profile.ToString()
                })
                .ToListAsync(cancellationToken);

            return users;
        }
    }
}
