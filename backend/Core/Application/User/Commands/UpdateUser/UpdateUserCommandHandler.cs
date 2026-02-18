
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User.Commands.UpdateUser
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommandRequest>
    {
        private readonly IClientControlContext _context;

        public UpdateUserCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateUserCommandRequest request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException(nameof(User), request.Id);
            }

            user.Username = request.Username;
            user.Profile = request.Profile;
            user.SetModifiedAt(DateTime.Now);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
