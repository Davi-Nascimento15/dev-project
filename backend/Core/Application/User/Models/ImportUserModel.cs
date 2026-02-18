
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.User.Models
{
    public class ImportUserModel
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Profile { get; set; }

        public (bool valid, string error) Validate(List<Domain.User> listUsers)
        {
            switch (true)
            {
                case true when string.IsNullOrEmpty(Username):
                    return (false, "Nome obrigatório");
                case true when string.IsNullOrEmpty(PasswordHash):
                    return (false, "Senha obrigatório");
                case true when string.IsNullOrEmpty(Profile):
                    return (false, "Perfil obrigatório");
                case true when Profile.Equals("Administrador", StringComparison.OrdinalIgnoreCase) && Profile.Equals("Operador", StringComparison.OrdinalIgnoreCase):
                    return (false, "Perfil inválido");
                case true when listUsers.Any(x => x.Username == Username):
                    return (false, "Cadastro duplicado");
                default:
                    return (true, "");
            }
        }
    }
}
