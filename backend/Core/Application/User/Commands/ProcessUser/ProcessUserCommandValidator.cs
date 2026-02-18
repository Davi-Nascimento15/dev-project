
using System;
using FluentValidation;

namespace Application.User.Commands.ProcessUser
{
    public class ProcessUserCommandValidator : AbstractValidator<ProcessUserCommandRequest>
    {
        public ProcessUserCommandValidator()
        {            
        }
    }
}
