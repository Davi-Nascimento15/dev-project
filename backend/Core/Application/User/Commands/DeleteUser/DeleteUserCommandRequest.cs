
using MediatR;
using System;

using Domain;
using Domain.Entities;

namespace Application.User.Commands.DeleteUser
{
    public class DeleteUserCommandRequest : IRequest
    {
        public Guid Id { get; set; }
    }
}
