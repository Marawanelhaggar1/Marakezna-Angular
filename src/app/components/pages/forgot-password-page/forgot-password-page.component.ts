import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/auth-services.service';

@Component({
    selector: 'app-forgot-password-page',
    templateUrl: './forgot-password-page.component.html',
    styleUrls: ['./forgot-password-page.component.scss'],
})
export class ForgotPasswordPageComponent implements OnInit {
    forgetForm: FormGroup;

    constructor(
        private _authService: UserService,
        private _formBuilder: FormBuilder
    ) {
        this.forgetForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }
    ngOnInit(): void {}

    onSubmit() {
        if (this.forgetForm.valid) {
            console.log(this.forgetForm.value);
            this.forgetPassword(this.forgetForm.value);
        } else {
            console.log(this.forgetForm.value);
            alert('Please enter valid mail');
        }
    }

    forgetPassword(body: any) {
        return this._authService.forgot(body).subscribe({
            next: (data) => {
                console.log(data);
            },
            error: (data) => {
                console.error(data);
            },
        });
    }
}
