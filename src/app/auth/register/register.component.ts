import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup | any;
  title = 'material-login';
  error:any
  isError:boolean = false
  constructor(
    private router:Router, private _service:SharedService
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('',Validators.required),
      email: new FormControl('', [Validators.required, Validators.email,Validators.pattern(
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
      ),]),
      password: new FormControl('', [Validators.required,Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )])
    });
   }
  ngOnInit(): void {
  }
  onSubmit(){
    if(!this.registerForm.valid){
      return;
    }
    this._service.register(this.registerForm.value).subscribe((res:any)=>{
      console.log(res);
      
    },(error)=>{
      this.isError = true
      this.error = error.error
    })
    setTimeout(()=>{
      if(this.isError !== true){
        alert("Successfully Register. Plz Login.")
        this.router.navigate([''])
      }else {
        alert(this.error + ". Plz Try Again")
      }
      
    },300)
    // localStorage.setItem('user',this.registerForm.value)
    
  }


}
