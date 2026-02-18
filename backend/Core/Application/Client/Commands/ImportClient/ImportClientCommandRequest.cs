using MediatR;

namespace Application.Client.Commands.ImportClient
{
    public class ImportClientCommandRequest : IRequest
    {
        public string CsvFile { get; set; }
    }
}
