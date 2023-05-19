using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
//using Microsoft.EntityFrameworkCore;
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
                    FullName = account.FullName,
                    Role = account.Role
                };

                var res = await _userManager.CreateAsync(user, account.Password);
                if (res.Succeeded)
                {
                    // Assign the role based on user input
                    if (account.Role == "Viewer")
                    {
                        await _userManager.AddToRoleAsync(user, "Viewer");
                    }
                    else if (account.Role == "Uploader")
                    {
                        await _userManager.AddToRoleAsync(user, "Uploader");
                    }
                    else if (account.Role == "Creator")
                    {
                        await _userManager.AddToRoleAsync(user, "Creator");
                    }
                    else
                    {
                        // If no role is specified, assign the "Viewer" role by default
                        await _userManager.AddToRoleAsync(user, "Viewer");
                    }

                    return Ok(new Response<string>(200, "", "Succeed"));
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
        //[HttpGet("GetAllUsers")]
        //public async Task<IActionResult> GetAllUsers()
        //{
        //    try
        //    {
        //        var users = _userManager.Users.ToList();
        //        var response = new Response<List<AppUser>>(200, "", users);
        //        return Ok(response);
        //    }
        //    catch (System.Exception e)
        //    {
        //        return BadRequest(new Response<string>(400, e.Message, null));
        //    }
        //}
        //[HttpGet("GetAllUsers")]
        //public async Task<IActionResult> GetAllUsers()
        //{
        //    try
        //    {
        //        var usersWithRoles = await GetUsersWithRoles();

        //        var response = new Response<List<object>>(200, "", usersWithRoles);
        //        return Ok(response);
        //    }
        //    catch (System.Exception e)
        //    {
        //        return BadRequest(new Response<string>(400, e.Message, null));
        //    }
        //}

        //private async Task<List<object>> GetUsersWithRoles()
        //{
        //    var users = await _userManager.Users.ToListAsync();
        //    var usersWithRoles = new List<object>();

        //    foreach (var user in users)
        //    {
        //        var roles = await _userManager.GetRolesAsync(user);
        //        usersWithRoles.Add(new
        //        {
        //            user.Id,
        //            user.UserName,
        //            user.Email,
        //            user.FullName,
        //            RoleNames = roles // thêm thuộc tính RoleNames chứa tên các role
        //        });
        //    }

        //    return usersWithRoles;
        //}
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
                usersWithRoles.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.FullName,
                    Roles = roles
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
    }
}
