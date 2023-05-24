using System;

namespace video_editing_api.Model.InputModel
{
    public class AccountModel
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string[] Roles { get; set; } // thuộc tính roles là một mảng

    }
}