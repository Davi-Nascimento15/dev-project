
using System;

namespace Application.Client.Models
{
    public class InvalidImportClientModel
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
        public string Error { get; set; }

        public InvalidImportClientModel(ImportClientModel model, string error)
        {
            FirstName = model.FirstName;
            LastName = model.LastName;
            PhoneNumber = model.PhoneNumber;
            Email = model.Email;
            DocumentNumber = model.DocumentNumber;
            BirthDate = model.BirthDate;
            PostalCode = model.PostalCode;
            AddressLine = model.AddressLine;
            Number = model.Number;
            Complement = model.Complement;
            City = model.City;
            State = model.State;
            Neighborhood = model.Neighborhood;
            Error = error;
        }
    }
}
