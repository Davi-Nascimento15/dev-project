using System;
using Domain.Entities;

namespace Domain
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public Profile Profile { get; set; }

        public User() { }

        public User(string username, string passwordHash, Profile profile)
        {
            Username = username;
            PasswordHash = passwordHash;
            Profile = profile;
            SetCreatedAt(DateTime.Now);
        }
    }
}
