
using System;
using FluentValidation;

namespace Application.Client.Commands.ProcessClient
{
    public class ProcessClientCommandValidator : AbstractValidator<ProcessClientCommandRequest>
    {
        public ProcessClientCommandValidator()
        {            
        }
    }
}
