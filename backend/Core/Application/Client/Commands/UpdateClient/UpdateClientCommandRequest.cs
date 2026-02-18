using System;
using Application.Client.Models;
using MediatR;

namespace Application.Client.Commands.CreateClient
{
    public class UpdateClientCommandRequest : ClientModel, IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}
