using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Client.Commands.DeleteClient
{
    public class UpdateClientCommandHandler : IRequestHandler<DeleteClientCommandRequest, Unit>
    {
        private readonly IClientControlContext _context;

        public UpdateClientCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteClientCommandRequest request, CancellationToken cancellationToken)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

            if (client is null)
            {
                throw new NotFoundException(nameof(Client), request.Id);
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
