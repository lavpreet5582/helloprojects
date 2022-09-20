import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | any;
  title = 'material-login';
  error: any
  isError: boolean = false
  accessToken: any
  data:any
  user:any
  constructor(
    private router: Router, private _service: SharedService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
      ),]),
      password: new FormControl('', [Validators.required, Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )])
    });
  }
  ngOnInit(): void {
    this.user = localStorage.getItem("user")

    if(this.user){
      this.router.navigate(['/home'])
    }
  }
  onSubmit() {
    this.isError = false
    if (!this.loginForm.valid) {
      return;
    }
    this._service.login(this.loginForm.value).subscribe((res: any) => {
      console.log(res.user.name);
      // console.log(error);
      this.data = res.user

    }, (error) => {
      console.log(error);
      this.isError = true
      this.error = error.error

    })
    console.log(this.isError);
    setTimeout(() => {
      if (this.isError !== true) {
        localStorage.setItem('user', this.data.email)
        this.router.navigate(['/home'])
      }
      else {

        alert(this.error + ". Plz Try Again")
      }
    }, 500)


  }


}
