
using Application.Client.Models;
using Application.Common.Interfaces;
using Application.User.Models;
using Common.Services;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Client.Commands.ProcessClient
{
    public class ProccessClientCommandHandler : IRequestHandler<ProcessClientCommandRequest>
    {
        private readonly IClientControlContext _context;

        public ProccessClientCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(ProcessClientCommandRequest request, CancellationToken cancellationToken)
        {
            var path = Path.Combine(AppContext.BaseDirectory, "Files_Clients");

            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            string[] files = Directory.GetFiles(path, "*.csv");

            foreach (string file in files)
            {
                try
                {
                    var listClientsBase = await _context.Clients.ToListAsync();
                    var listClients = ImportFileUserService.ImportFile<ImportClientModel>(file);
                    if (listClients.Any())
                    {
                        var listClientValid = new List<Domain.Client>();
                        var listClientInvalid = new List<InvalidImportClientModel>();
                        listClients.ForEach(item =>
                        {
                            var validate = item.Validate(listClientsBase);
                            if (validate.valid)
                                listClientValid.Add(new Domain.Client(

                                    item.FirstName,
                                    item.LastName,
                                    item.Email,
                                    item.PhoneNumber,
                                    item.DocumentNumber,
                                    item.BirthDate,
                                    new Domain.Address
                                    (
                                        item.PostalCode,
                                        item.AddressLine,
                                        item.Number,
                                        item.Complement,
                                        item.Neighborhood,
                                        item.City,
                                        item.State
                                    )
                                ));
                            else
                                listClientInvalid.Add(new InvalidImportClientModel(item, validate.error));
                        });

                        File.Delete(file);

                        if (listClientValid.Any())
                        {
                            await _context.Clients.AddRangeAsync(listClientValid);
                            await _context.SaveChangesAsync(cancellationToken);
                        }

                        if (listClientInvalid.Any())
                        {
                            //todo: Clientes não validados
                        }
                    }
                }
                catch
                {

                }
            }

            return Unit.Value;
        }
    }
}
