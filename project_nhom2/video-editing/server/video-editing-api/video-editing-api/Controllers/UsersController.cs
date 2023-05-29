using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using video_editing_api.Model;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using Microsoft.EntityFrameworkCore;

namespace video_editing_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _config;
        public UsersController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok();
        }


        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp(AccountModel account)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(account.Username);
                if (user != null)
                {
                    return BadRequest(new Response<string>(400, "Username already used", null));
                }
                user = await _userManager.FindByEmailAsync(account.Email);
                if (user != null)
                {
                    return BadRequest(new Response<string>(400, "Email already used", null));
                }

                user = new AppUser
                {
                    UserName = account.Username,
                    Email = account.Email,
                    FullName = account.FullName
                };

                var res = await _userManager.CreateAsync(user, account.Password);
                if (res.Succeeded)
                {
                    // Assign the roles based on user input or default to "Read"
                    var rolesToAdd = new List<string>();
                    if (account.Roles != null && account.Roles.Any())
                    {
                        // Validate Role input
                        var validRoles = new List<string> { Role.Read, Role.Write, Role.Excute, Role.Admin };
                        rolesToAdd = account.Roles.Where(role => validRoles.Contains(role)).ToList();
                    }
                    if (!rolesToAdd.Any())
                    {
                        rolesToAdd.Add(Role.Read);
                    }

                    // Add the specified roles to the user
                    await _userManager.AddToRolesAsync(user, rolesToAdd);


                    // Retrieve the user information from the database
                    var newUser = await _userManager.FindByNameAsync(account.Username);

                    // Create a new object that contains the user information to be returned to the client
                    var response = new
                    {
                        Id = newUser.Id,
                        UserName = newUser.UserName,
                        Email = newUser.Email,
                        FullName = newUser.FullName,
                        Roles = await _userManager.GetRolesAsync(newUser)
                    };

                    // Return this object as the response from the SignUp method
                    return Ok(new Response<object>(200, "", response));
                }
                else
                {
                    return BadRequest(new Response<string>(400, "An unknown error occurred, please try again.", null));
                }

            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }


        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn(AccountModel account)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(account.Username);
                if (user == null)
                {
                    user = await _userManager.FindByEmailAsync(account.Username) != null ? await _userManager.FindByEmailAsync(account.Username) : null;
                }
                if (user == null)
                {
                    return BadRequest(new Response<string>(400, "Incorrect Username", null));
                }

                var result = await _signInManager.PasswordSignInAsync(user, account.Password, true, true);
                if (!result.Succeeded)
                {
                    return BadRequest(new Response<string>(400, "Incorrect Password", null));
                }

                var roles = await _userManager.GetRolesAsync(user);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,user.UserName),
                    new Claim(ClaimTypes.Role, string.Join(',', roles))// thêm role
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddHours(2),
                    SigningCredentials = creds,
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);

                var res = new
                {
                    Token = tokenHandler.WriteToken(token),
                    FullName = user.FullName,
                    Username = user.UserName,
                    Role = roles
                };
                return Ok(new Response<object>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(AccountModel account)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(account.Username);
                if (user == null)
                {
                    user = await _userManager.FindByEmailAsync(account.Username) != null ? await _userManager.FindByEmailAsync(account.Username) : null;
                }
                if (user == null)
                {
                    return BadRequest(new Response<string>(400, "Incorrect Username", null));
                }

                var removePassword = await _userManager.RemovePasswordAsync(user);
                var updatePassword = await _userManager.AddPasswordAsync(user, account.Password);
                return Ok(new Response<object>(200, "", updatePassword));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }

        }
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                IAsyncEnumerable<AppUser> users = _userManager.Users.ToAsyncEnumerable();
                var usersWithRoles = await GetUsersWithRoles(users);

                var response = new Response<List<object>>(200, "", usersWithRoles);
                return Ok(response);
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        private async Task<List<object>> GetUsersWithRoles(IAsyncEnumerable<AppUser> users)
        {
            var usersWithRoles = new List<object>();

            await foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                //them creaton
                var createOn = user.CreatedOn;
                usersWithRoles.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.FullName,
                    Roles = roles,
                    CreateOn = createOn
                });
            }

            return usersWithRoles;
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new Response<string>(404, "User not found", null));
                }

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new Response<string>(400, "An error occurred while deleting the user", null));
                }

                return Ok(new Response<string>(200, "", "User deleted successfully"));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        // gán quyền cho user
        [HttpPost("AddRole/{userId}/{roleName}")]
        public async Task<IActionResult> AddRole(string userId, string roleName)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new Response<string>(404, "User not found", null));
                }

                var res = await _userManager.AddToRoleAsync(user, roleName);

                if (res.Succeeded)
                {
                    return Ok(new Response<string>(200, "", "Role added successfully"));
                }
                else
                {
                    return BadRequest(new Response<string>(400, "An unknown error occurred, please try again.", null));
                }
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, AccountModel account)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new Response<string>(404, "User not found", null));
                }

                // Update user information
                user.UserName = account.Username;
                user.Email = account.Email;
                user.FullName = account.FullName;

                // Update user roles
                if (account.Roles != null && account.Roles.Any())
                {
                    // Validate Role input
                    var validRoles = new List<string> { Role.Read, Role.Write, Role.Excute, Role.Admin };
                    if (account.Roles.Any(role => !validRoles.Contains(role)))
                    {
                        return BadRequest(new Response<string>(400, "Invalid role", null));
                    }
                    // Remove all existing roles and assign new roles to the user
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    var removeRoles = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    var addRoles = await _userManager.AddToRolesAsync(user, account.Roles);
                }

                // Save changes to the database
                var res = await _userManager.UpdateAsync(user);
                if (res.Succeeded)
                {
                    return Ok(new Response<string>(200, "", "User information and roles updated successfully"));
                }
                else
                {
                    return BadRequest(new Response<string>(400, "An unknown error occurred, please try again.", null));
                }
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        // update dựa trên username
        [HttpPut("update/{username}")]
        public async Task<IActionResult> UpdateUserWithUserName(string username, AccountModel account)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(username);
                if (user == null)
                {
                    return NotFound(new Response<string>(404, "User not found", null));
                }

                // Update user information
                user.Email = account.Email;
                user.FullName = account.FullName;

                // Update user roles
                if (account.Roles != null && account.Roles.Any())
                {
                    // Validate Role input
                    var validRoles = new List<string> { Role.Read, Role.Write, Role.Excute, Role.Admin };
                    if (account.Roles.Any(role => !validRoles.Contains(role)))
                    {
                        return BadRequest(new Response<string>(400, "Invalid role", null));
                    }
                    // Remove all existing roles and assign new roles to the user
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    var removeRoles = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    var addRoles = await _userManager.AddToRolesAsync(user, account.Roles);
                }
                // Save changes to the database
                var res = await _userManager.UpdateAsync(user);
                if (res.Succeeded)
                {
                    return Ok(new Response<string>(200, "", "User information and roles updated successfully"));
                }
                else
                {
                    return BadRequest(new Response<string>(400, "An unknown error occurred, please try again.", null));
                }
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }


    }
}
