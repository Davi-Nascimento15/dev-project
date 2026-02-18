
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

namespace Application.User.Commands.ProcessUser
{
    public class ProccessUserCommandHandler : IRequestHandler<ProcessUserCommandRequest>
    {
        private readonly IClientControlContext _context;

        public ProccessUserCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(ProcessUserCommandRequest request, CancellationToken cancellationToken)
        {
            var path = Path.Combine(AppContext.BaseDirectory, "Files_Users");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            string[] files = Directory.GetFiles(path, "*.csv");

            foreach (string file in files)
            {
                try
                {
                    var listUsersBase = await _context.Users.ToListAsync();
                    var listUsers = ImportFileUserService.ImportFile<ImportUserModel>(file);
                    if (listUsers.Any())
                    {
                        var listUserValid = new List<Domain.User>();
                        var listUserInvalid = new List<InvalidImportUserModel>();
                        listUsers.ForEach(item =>
                        {
                            var validate = item.Validate(listUsersBase);
                            if (validate.valid)
                                listUserValid.Add(new Domain.User(item.Username, item.PasswordHash, item.Profile.Equals("Administrador", StringComparison.OrdinalIgnoreCase) ? Profile.Administrator : Profile.Operator));
                            else
                                listUserInvalid.Add(new InvalidImportUserModel(item.Username, item.PasswordHash, item.Profile, validate.error));
                        });

                        File.Delete(file);

                        if (listUserValid.Any())
                        {
                            await _context.Users.AddRangeAsync(listUserValid);
                            await _context.SaveChangesAsync(cancellationToken);
                        }
                        
                        if(listUserInvalid.Any()){
                            //todo: Usuários não validados
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
