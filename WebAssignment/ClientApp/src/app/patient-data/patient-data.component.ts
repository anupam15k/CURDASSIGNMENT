import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterContainerComponent, ToasterService } from 'angular2-toaster';
import { BodyOutputType,Toast } from 'angular2-toaster';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";

@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html'
})
export class PatientDataComponent implements OnInit {
  patientData: PatientData[];
  GenderList: string[] = ["M", "F"];
  myform: FormGroup;
  Name: FormControl;
  SurName: FormControl;
  Gender: FormControl;
  DOB: FormControl;
  City: FormControl;
  State: FormControl;
  model2: Date;
  Cities: any;
  States: any;
  baseUrl: string;


  constructor(public http: Http, @Inject('BASE_URL') baseUrl: string, private toasterService: ToasterService) {
    this.baseUrl = baseUrl;
    http.get(baseUrl + 'api/PatientData/GetPatient').subscribe(result => {
      this.patientData = result.json();
    }, error => console.error(error));

    //http.get(baseUrl + 'api/PatientData/Cities').subscribe(result => {
    //  this.Cities = result;
    //}, error => console.error(error));

    http.get(baseUrl + 'api/PatientData/GetStates').subscribe(result => {
      this.States = result.json();
    }, error => console.error(error));
  }

  createFormControls() {
    this.Name = new FormControl("", Validators.required);
    this.SurName = new FormControl("", Validators.required);
    this.Gender = new FormControl("", Validators.required);
    this.DOB = new FormControl("", Validators.required);
    this.City = new FormControl("", Validators.required);
    this.State = new FormControl("", Validators.required);
  }

  createForm() {
    this.myform = new FormGroup({
      Name: this.Name,
      SurName: this.SurName,
      Gender: this.Gender,
      DOB: this.DOB,
      City: this.City,
      State: this.State,
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  onSubmit() {
    if (this.myform.valid && this.validatePatient()) {
      let params = new HttpParams();
      var Name = this.myform.get('Name').value;
      params = params.append('Name', Name);
      var SurName = this.myform.get('SurName').value;
      params = params.append('SurName', SurName);
      var DOB = this.myform.get('DOB').value;
      params = params.append('DOB', DOB);
      var Gender = this.myform.get('Gender').value;
      params = params.append('Gender', Gender);
      var State = this.myform.get('State').value;
      params = params.append('State', State);
      var CityId = this.myform.get('City').value;
      params = params.append('City', CityId);

      let headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      var data = {
        Name: this.myform.get('Name').value,
        SurName: this.myform.get('SurName').value,
        DOB: this.myform.get('DOB').value,
        Gender: this.myform.get('Gender').value,
        State: this.myform.get('State').value,
        CityId: this.myform.get('City').value,
      };


      this.http.post(this.baseUrl + 'api/PatientData/SavePatient', data, { headers}).subscribe(result => {
        this.http.get(this.baseUrl + 'api/PatientData/GetPatient').subscribe(result => {
          this.patientData = result.json();
        }, error => console.error(error));
        this.toasterService.pop("success", "Patient fetched successfully");
      }, error => this.toasterService.pop("error", error));
      this.myform.reset();
    }
  }

  get today() {
    return new Date();
  }

  getCity(event: any) {
    let params = new HttpParams();
    params = params.append('StateId', event.target.value);

    this.http.get(this.baseUrl + 'api/PatientData/GetCities/' + event.target.value).subscribe(result => {
      this.Cities = result.json();
    }, error => console.error(error));

  }

  validatePatient() {
    var errorMessage = [];
    var Name = this.myform.get('Name').value;
    if (Name == undefined || Name == "") {
      errorMessage.push("Please enter name ");
    }
    if (Name !== undefined && /[^a-zA-Z0-9]/.test(Name)) {
      errorMessage.push("Name should be alphabets with no special character");
    }
    var SurName = this.myform.get('SurName').value;
    if (SurName == undefined || SurName == "") {
      errorMessage.push("Please enter SurName");
    }
    if (SurName !== undefined && /[^a-zA-Z0-9]/.test(SurName)) {
      errorMessage.push("SurName should be alphabets with no special character");
    }

    var DOB = this.myform.get('DOB').value;
    if (DOB == undefined || DOB == "") {
      errorMessage.push("Please enter DOB");
    }
    if (DOB !== undefined) {
      var today = new Date();
      if (DOB > today) {
        errorMessage.push("DOB Should not be greater than today’s date.");
      }
      var enteredAge = this.getAge(DOB);
      if (enteredAge > 100) {
        errorMessage.push("DOB Should not be less than 100 yrs.");
      }
    }

    var Gender = this.myform.get('Gender').value;
    if (Gender == undefined || Gender == "") {
      errorMessage.push("Please enter Gender");
    }

    var State = this.myform.get('State').value;
    if (State == undefined || State == "") {
      errorMessage.push("Please enter State ");
    }

    var City = this.myform.get('City').value;
    if (City == undefined || City == "") {
      errorMessage.push("Please enter City");
    }

    var toast: Toast = {
      type: 'error',
      title: 'Validation Errors',
      body: errorMessage.join("<br/>"),
      bodyOutputType: BodyOutputType.TrustedHtml
    };

    if (errorMessage.length > 0) {
      this.toasterService.pop(toast);
      //this.toastr.error(errorMessage.join(" < br />"), "Validation Errors")
      return false;
    }

    return true;
  }

  getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  fetch() {
    this.patientData = [];

    let params = new HttpParams();
    var Name = this.myform.get('Name').value;
    params = params.append('Name', Name);
    var SurName = this.myform.get('SurName').value;
    params = params.append('SurName', SurName);
    var DOB = this.myform.get('DOB').value;
    params = params.append('DOB', DOB);
    var Gender = this.myform.get('Gender').value;
    params = params.append('Gender', Gender);
    var State = this.myform.get('State').value;
    params = params.append('State', State);
    var CityId = this.myform.get('City').value;
    params = params.append('City', CityId);

    this.http.post(this.baseUrl + 'api/PatientData/Fetch', { params: params }).subscribe(result => {
      this.patientData = result.json();
      this.toasterService.pop("success", "Patient fetched successfully");
    }, error => this.toasterService.pop("error", error));
  }

}

interface PatientData {
  name: string;
  surName: string;
  gender: string;
  dob: string;
  cityId: string;
}
