using System;
using FluentValidation;

namespace Application.Client.Commands.DeleteClient
{
    public class DeleteClientCommandValidator : AbstractValidator<DeleteClientCommandRequest>
    {
        public DeleteClientCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .NotNull()
                .WithMessage((obj, propertyValue) => $"ID obrigatório");
        }
    }
}
