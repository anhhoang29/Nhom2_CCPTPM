using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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

namespace video_editing_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public RoleController(RoleManager<AppRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            var role = new AppRole { Name = roleName };
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                // Assign the new role to all users with the appropriate role
                var users = await _userManager.GetUsersInRoleAsync("Viewer"); // replace "Viewer" with the appropriate role
                foreach (var user in users)
                {
                    var addToRoleResult = await _userManager.AddToRoleAsync(user, roleName);
                    if (!addToRoleResult.Succeeded)
                    {
                        // handle error
                    }
                }

                return Ok("Role created successfully and assigned to users");
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        //[HttpGet("GetAllUsersWithRoles")]
        //public async Task<IActionResult> GetAllUsersWithRoles()
        //{
        //    try
        //    {
        //        var users = await _userManager.Users.ToListAsync();

        //        var usersWithRoles = new List<object>();

        //        foreach (var user in users)
        //        {
        //            var roles = await _userManager.GetRolesAsync(user);
        //            usersWithRoles.Add(new
        //            {
        //                user.Id,
        //                user.UserName,
        //                user.Email,
        //                user.FullName,
        //                Roles = roles
        //            });
        //        }

        //        var response = new Response<List<object>>(200, "", usersWithRoles);
        //        return Ok(response);
        //    }
        //    catch (System.Exception e)
        //    {
        //        return BadRequest(new Response<string>(400, e.Message, null));
        //    }
        //}
    }

}

