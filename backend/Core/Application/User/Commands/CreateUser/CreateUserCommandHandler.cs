
using Application.Common.Interfaces;
using Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User.Commands.CreateUser
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommandRequest, Guid>
    {
        private readonly IClientControlContext _context;

        public CreateUserCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateUserCommandRequest request, CancellationToken cancellationToken)
        {
            var user = new Domain.User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Profile = request.Profile
            };

            user.SetCreatedAt(DateTime.Now);

            _context.Users.Add(user);

            await _context.SaveChangesAsync(cancellationToken);

            return user.Id;
        }
    }
}
