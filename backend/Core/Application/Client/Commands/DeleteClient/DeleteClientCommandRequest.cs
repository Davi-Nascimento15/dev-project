using System;
using Application.Client.Models;
using MediatR;

namespace Application.Client.Commands.DeleteClient
{
    public class DeleteClientCommandRequest : ClientModel, IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}
