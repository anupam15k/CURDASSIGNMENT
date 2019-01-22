using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

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

        [HttpPost("[action]")]
        public HttpResponseMessage SavePatient([FromBody] iMedOneDB.Models.TBLPATIENT pat)
        {
            if (pat != null)
            {
                var savedList = iMedOneDB.DBContext.GetData<iMedOneDB.Models.TBLPATIENT>();

                var duplicate = savedList.Any(x => x.Name.ToLower() == pat.Name.ToLower() && x.SurName.ToLower() == pat.SurName.ToLower() &&
                                x.DOB == pat.DOB && x.Gender == pat.Gender && x.CityId == pat.CityId);
                if (duplicate)
                {
                    var response = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    response.Content = new StringContent("duplicate");
                    return response;
                }

                pat.Id = savedList.Count() + 1;
                var patientList = new List<iMedOneDB.Models.TBLPATIENT>();
                patientList.Add(pat);
                foreach (var item in savedList)
                {
                    patientList.Add(item);
                }
                iMedOneDB.DBContext.SaveAll<iMedOneDB.Models.TBLPATIENT>(patientList as IEnumerable<iMedOneDB.Models.TBLPATIENT>);
                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
        }

        [HttpPost("[action]")]
        public IEnumerable<iMedOneDB.Models.TBLPATIENT> Fetch([FromBody] iMedOneDB.Models.TBLPATIENT pat)
        {
            var savedList = iMedOneDB.DBContext.GetData<iMedOneDB.Models.TBLPATIENT>();
            var patList = savedList.Where(x => x.Name == pat.Name || x.SurName == pat.SurName ||
                            x.DOB == pat.DOB || x.Gender == pat.Gender || x.CityId == pat.CityId);

            return patList;
        }
    }

}


