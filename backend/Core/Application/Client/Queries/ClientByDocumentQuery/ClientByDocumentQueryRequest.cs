using System.Collections.Generic;
using MediatR;

namespace Application.Client.Queries.ClientByDocumentQuery
{
    public class ClientByDocumentQueryRequest : IRequest<IEnumerable<ClientByDocumentQueryResponse>>
    {
        public string DocumentClient { get; set; }
    }
}
