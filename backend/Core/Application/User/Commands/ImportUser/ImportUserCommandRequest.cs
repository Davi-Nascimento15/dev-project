using MediatR;

namespace Application.User.Commands.ImportUser
{
    public class ImportUserCommandRequest : IRequest
    {
        public string CsvFile { get; set; }
    }
}
