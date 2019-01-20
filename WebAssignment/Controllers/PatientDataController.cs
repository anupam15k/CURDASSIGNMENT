using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebAssignment.Controllers
{
    [Route("api/[controller]")]
    public class PatientDataController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<iMedOneDB.Models.Tblstate> GetStates()
        {
            var stateList = iMedOneDB.DBContext.GetData<iMedOneDB.Models.Tblstate>();
            return stateList;
        }

        [HttpGet("[action]")]
        public IEnumerable<iMedOneDB.Models.Tblcity> GetCities(int StateId)
        {
            var cityList = iMedOneDB.DBContext.GetData<iMedOneDB.Models.Tblcity>(StateId);
            return cityList;
        }

        [HttpGet("[action]")]
        public IEnumerable<iMedOneDB.Models.TBLPATIENT> GetPatient()
        {
            var pat = iMedOneDB.DBContext.GetData<iMedOneDB.Models.TBLPATIENT>();
            return pat;
        }

    }
        
}
