using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Common;

namespace Application.Client.Queries.ClientByDocumentQuery
{
    public class ClientByDocumentQueryHandler : IRequestHandler<ClientByDocumentQueryRequest, IEnumerable<ClientByDocumentQueryResponse>>
    {
        private readonly IClientControlContext _context;

        public ClientByDocumentQueryHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ClientByDocumentQueryResponse>> Handle(ClientByDocumentQueryRequest request, CancellationToken cancellationToken)
        {
            var client = await _context.Clients
                .Where(x => x.DocumentNumber.Contains(Extensions.UnMask(request.DocumentClient)))
                .Select(x => new ClientByDocumentQueryResponse
                {
                    Id = x.Id,
                    CreatedAt = x.CreatedAt,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    PhoneNumber = x.PhoneNumber,
                    DocumentNumber = x.DocumentNumber,
                    BirthDate = x.BirthDate,
                    Address = new Models.AddressModel
                    {
                        PostalCode = x.Address.PostalCode,
                        AddressLine = x.Address.AddressLine,
                        Number = x.Address.Number,
                        Complement = x.Address.Complement,
                        Neighborhood = x.Address.Neighborhood,
                        City = x.Address.City,
                        State = x.Address.State
                    }
                })
                .OrderBy(x => x.FirstName)
                .ThenBy(x => x.LastName)
                .ToListAsync();

            return client;
        }
    }
}
