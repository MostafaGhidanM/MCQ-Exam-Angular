import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  students: any = []

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.createForm()
    this.getStudents()
  }
  createForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })

  }
  submit() {
    const model = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password
    }
    let index = this.students.findIndex((item: any) => item.email == this.userForm.value.email)
    console.log(index)
    if (index !== -1) {
      this.toastr.error('الإيميل موجود بالفعل', "", {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 3000,
        closeButton: true,
      })

    } else {
      this.authService.createUser(model).subscribe(res => {
        this.toastr.success('تم إنشاء الحساب بنجاح', "", {
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
  getStudents() {
    this.authService.getUsers('students').subscribe((res: any) => {
      this.students = res;
    }, error => {

    })
  }


}
