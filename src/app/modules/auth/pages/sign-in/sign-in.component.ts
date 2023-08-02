import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType = false; 

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      nik: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { nik, password } = this.form.value;
    if (this.form.invalid) {
      return;
    }

    this._authService.login(nik, password).subscribe(
      (response) => {
        console.log('Login successful. Token:', response.token);
        this._authService.setToken(response.token); // Store the token using the AuthService
        this._router.navigate(['/']);
      },
      (error) => {
        console.log('Login error:', error);
      }
    );
  }
}
