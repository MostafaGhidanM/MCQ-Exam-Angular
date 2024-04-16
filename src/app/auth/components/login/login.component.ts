import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  users: any = [];
  type: string = 'students';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.getUsers()
  }
  getRole(event: any) {
    this.type = event.value;
    this.getUsers()
  }

  getUsers() {
    this.authService.getUsers(this.type).subscribe((res: any) => {
      this.users = res;
    }, error => {

    })
  }
  createForm() {
    console.log(this.type)
    this.loginForm = this.fb.group({
      type: [this.type],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })

  }
  submit() {
    let index = this.users.findIndex((item: any) => item.email == this.loginForm.value.email && item.password == this.loginForm.value.password)
    console.log(index)
    if (index == -1) {
      this.toastr.error('الإيميل أو كلمة السر خطأ', "", {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 3000,
        closeButton: true,
      })

    } else {
      const model = {
        username: this.users[index].username,
        type: this.users[index].type
      }

      this.authService.login(model).subscribe(res => {
        console.log(model)
        this.toastr.success('تم تسجيل الدخول بنجاح', "", {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 3000,
          closeButton: true,
        }
        )
        this.router.navigate(['/subjects'])
      }, error => console.log(error.error.message))

    }

  }


}
