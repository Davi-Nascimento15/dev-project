
using Application.Common.Interfaces;
using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User.Commands.ImportUser
{
    public class UpdateUserCommandHandler : IRequestHandler<ImportUserCommandRequest>
    {
        private readonly IClientControlContext _context;

        public UpdateUserCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(ImportUserCommandRequest request, CancellationToken cancellationToken)
        {
            var base64 = request.CsvFile.Contains(",") ? request.CsvFile.Split(',')[1] : request.CsvFile;
            var bytes = Convert.FromBase64String(base64);

            var directory = Path.Combine(AppContext.BaseDirectory, "Files_Users");
            var destinationPath = Path.Combine(AppContext.BaseDirectory, "Files_Users", $"file_import_{Guid.NewGuid()}.csv");

            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            await File.WriteAllBytesAsync(destinationPath, bytes);

            return Unit.Value;
        }
    }
}
