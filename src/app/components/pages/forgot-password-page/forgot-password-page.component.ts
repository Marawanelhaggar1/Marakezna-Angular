import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/auth-services.service';

@Component({
    selector: 'app-forgot-password-page',
    templateUrl: './forgot-password-page.component.html',
    styleUrls: ['./forgot-password-page.component.scss'],
})
export class ForgotPasswordPageComponent implements OnInit {
    lang?: string;
    forgetForm: FormGroup;
    alert?: string;
    alertStatus!: string;
    constructor(
        private _authService: UserService,
        private _formBuilder: FormBuilder
    ) {
        this.forgetForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }
    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
    }

    onSubmit() {
        if (this.forgetForm.valid) {
            console.log(this.forgetForm.value);
            this.forgetPassword(this.forgetForm.value);
        } else {
            console.log(this.forgetForm.value);
            this.alertStatus = 'success';
            this.alert =
                this.lang === 'ltr' ? 'Enter A Valid Email' : ' بيانات خاطئه ';
        }
    }

    forgetPassword(body: any) {
        return this._authService.forgot(body).subscribe({
            next: (data) => {
                console.log(data);
                this.alertStatus = 'success';
                this.alert =
                    this.lang === 'ltr'
                        ? 'Email Sent Successfully'
                        : 'تم ارسال أيميل على حسابك';
            },
            error: (data) => {
                console.error(data);
                this.alertStatus = 'success';
                this.alert =
                    this.lang === 'ltr' ? 'Wrong Email' : ' حسابك خاطئ';
            },
        });
    }
}
