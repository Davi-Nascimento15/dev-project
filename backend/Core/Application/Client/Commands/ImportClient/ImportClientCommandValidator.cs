
using System;
using FluentValidation;

namespace Application.Client.Commands.ImportClient
{
    public class ImportUserCommandValidator : AbstractValidator<ImportClientCommandRequest>
    {
        public ImportUserCommandValidator()
        {
            RuleFor(x => x.CsvFile)
                .NotEmpty().WithMessage("O arquivo não pode estar vazio.")
                .Must(IsValidBase64).WithMessage("A string não é um Base64 válido.")
                .Must(IsValidCsv).WithMessage("O arquivo precisa ser um CSV.");
        }

        private bool IsValidBase64(string base64)
        {
            if (string.IsNullOrWhiteSpace(base64)) return false;

            var rawBase64 = base64.Contains(",") ? base64.Split(',')[1] : base64;

            Span<byte> buffer = new Span<byte>(new byte[rawBase64.Length]);
            return Convert.TryFromBase64String(rawBase64, buffer, out _);
        }

        private bool IsValidCsv(string base64)
        {
            try
            {
                var rawBase64 = base64.Contains(",") ? base64.Split(',')[1] : base64;
                var bytes = Convert.FromBase64String(rawBase64);
                var content = System.Text.Encoding.UTF8.GetString(bytes);

                return content.Contains(",") || content.Contains(";");
            }
            catch
            {
                return false;
            }
        }
    }
}
