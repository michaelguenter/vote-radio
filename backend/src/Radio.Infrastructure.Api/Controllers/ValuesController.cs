﻿using Microsoft.AspNetCore.Mvc;

namespace Radio.Infrastructure.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    public class ValuesController : Controller
    {
        [HttpGet]
        public string Get()
        {
            return "Hello World";
        }
    }
}