using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
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
        [HttpGet("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roles = _roleManager.Roles.ToAsyncEnumerable();

                List<string> roleNames = new List<string>();

                await foreach (var role in roles)
                {
                    roleNames.Add(role.Name);
                }

                if (roleNames != null && roleNames.Count > 0)
                {
                    return Ok(new Response<List<string>>(200, "", roleNames));
                }
                else
                {
                    return Ok(new Response<List<string>>(200, "", new List<string>()));
                }
            }
            catch (Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            var role = new AppRole { Name = roleName };
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                return Ok("Role created successfully");
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpPost("AddRole/{userId}/{roleName}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRole(string userId, string roleName)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new Response<string>(404, "User not found", null));
                }

                var role = await _roleManager.FindByNameAsync(roleName);

                if (role == null)
                {
                    return NotFound(new Response<string>(404, "Role not found", null));
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
            catch (Exception e)
            {

                return BadRequest(new Response<string>(400, e.Message, null));
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

