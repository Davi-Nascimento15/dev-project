using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Client.Commands.CreateClient
{
    public class UpdateClientCommandHandler : IRequestHandler<UpdateClientCommandRequest, Unit>
    {
        private readonly IClientControlContext _context;

        public UpdateClientCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateClientCommandRequest request, CancellationToken cancellationToken)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

            if (client is null)
            {
                throw new NotFoundException(nameof(Client), request.Id);
            }

            client.Update(
                request.FirstName,
                request.LastName,
                request.PhoneNumber,
                request.Email,
                request.DocumentNumber,
                request.BirthDate,
                new(
                    request.Address.PostalCode,
                    request.Address.AddressLine,
                    request.Address.Number,
                    request.Address.Complement,
                    request.Address.Neighborhood,
                    request.Address.City,
                    request.Address.State
                    )
            );

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
