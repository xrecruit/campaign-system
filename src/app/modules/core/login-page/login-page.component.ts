import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/modules/core/login-page/login.service'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material';
import { ForgetPasswordComponent } from '../../modals/forget-password/forget-password.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  apiInProgress: boolean
  loginError: string
  popUpValue: any

  constructor(
    private loginServices: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    public localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
  }

  loginForm = this.formBuilder.group({
    email: ['', Validators.compose([
      Validators.required,
      Validators.email
    ]
    )],
    password: ['', Validators.compose([
      Validators.required,
    ])],
    remember_me: [true]
  })

  get email() {
    return this.loginForm.get("email")
  }

  get password() {
    return this.loginForm.get("password")
  }

  async onLogin(value) {
    this.router.navigate(['settings']);
  }

  forgetPassword() {
    this.matDialog.open(ForgetPasswordComponent, {
      minWidth: '300px',
      maxWidth: '40vw',
      width: '30%'
    }).afterClosed().subscribe(result => {
      if (result) this.popUpValue = [result, false];
    })
  }
}
