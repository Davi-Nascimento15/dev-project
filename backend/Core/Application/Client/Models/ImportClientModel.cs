
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Client.Models
{
    public class ImportClientModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string DocumentNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public string PostalCode { get; set; }
        public string AddressLine { get; set; }
        public string Number { get; set; }
        public string Complement { get; set; }
        public string Neighborhood { get; set; }
        public string City { get; set; }
        public string State { get; set; }

        public (bool valid, string error) Validate(List<Domain.Client> listClients)
        {
            switch (true)
            {
                case true when string.IsNullOrEmpty(FirstName):
                    return (false, "Campo FirstName obrigatório");
                case true when  string.IsNullOrEmpty(LastName):
                    return (false, "Campo LastName obrigatório");
                case true when string.IsNullOrEmpty(Email):
                    return (false, "Campo Email obrigatório");
                case true when string.IsNullOrEmpty(PhoneNumber):
                    return (false, "Campo PhoneNumber obrigatório");
                case true when string.IsNullOrEmpty(DocumentNumber):
                    return (false, "Campo DocumentNumber obrigatório");
                case true when BirthDate == new DateTime():
                    return (false, "Campo BirthDate obrigatório");
                case true when string.IsNullOrEmpty(PostalCode):
                    return (false, "Campo PostalCode obrigatório");
                case true when string.IsNullOrEmpty(AddressLine):
                    return (false, "Campo AddressLine obrigatório");
                case true when string.IsNullOrEmpty(Number):
                    return (false, "Campo Number obrigatório");
                case true when string.IsNullOrEmpty(Neighborhood):
                    return (false, "Campo Neighborhood obrigatório");
                case true when string.IsNullOrEmpty(City):
                    return (false, "Campo City obrigatório");
                case true when string.IsNullOrEmpty(State):
                    return (false, "Campo State obrigatório");
                case true when listClients.Any(x => x.Email == Email || x.DocumentNumber == DocumentNumber):
                    return (false, "Cadastro duplicado");
                default:
                    return (true, "");
            }
        }
    }
}
