
using System;

namespace Application.User.Models
{
    public class InvalidImportUserModel
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Profile { get; set; }
        public string Error { get; set; }

        public InvalidImportUserModel(string username, string passwordHash, string profile, string error)
        {
            Username = username;
            PasswordHash = passwordHash;
            Profile = profile;
            Error = error;
        }
    }
}
