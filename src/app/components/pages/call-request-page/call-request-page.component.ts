import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Centers } from 'src/app/core/models/centers';
import { Doctor } from 'src/app/core/models/doctor';
import { UserService } from 'src/app/core/services/auth-services.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { CentersService } from 'src/app/core/services/centers.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-call-request-page',
    templateUrl: './call-request-page.component.html',
    styleUrls: ['./call-request-page.component.scss'],
})
export class CallRequestPageComponent {
    lang?: string;
    sub!: any;
    requestForm: FormGroup;
    center!: Centers;
    doctor!: Doctor;
    centerId!: number;
    doctorId!: number;

    constructor(
        private _ActivatedRoute: ActivatedRoute,
        private _centerService: CentersService,
        private _router: Router,
        private _doctorService: DoctorService,
        private _bookingService: BookingService,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _Cookie: CookieService
    ) {
        this.requestForm = this._formBuilder.group({
            user_name: ['', [Validators.required]],
            user_email: ['', [Validators.required, Validators.email]],
            user_mobile: ['', [Validators.required]],
            center: [''],

            service_id: ['', this.centerId ? [Validators.required] : null],
        });
        console.log(this.doctorId);
    }

    ngOnInit() {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.sub = Object.assign({}, this._ActivatedRoute.snapshot.queryParams);

        console.log(this.sub.center);
        this.doctorId = this.sub.doctor;
        console.log(this.doctorId);
        if (this.sub.doctor) {
            this.getDoctorById(this.sub.doctor);
        } else if (this.sub.center) {
            this.getCenterById(this.sub.center);
        }
    }

    getDoctorById(id: number) {
        return this._doctorService.getById(id).subscribe((data) => {
            console.log(data.data);
            this.doctor = data.data;
            // this.doctorId = this.doctor.id;
        });
    }

    getCenterById(id: number) {
        return this._centerService.getById(id).subscribe((data) => {
            this.center = data.data;
            this.centerId = data.data.id;
        });
    }

    postCall(body: any) {
        return this._bookingService
            .requestCall({
                doctor_id: this.doctorId,
                center_id: this.centerId
                    ? this.centerId
                    : this.requestForm.value.center,
                ...body,
            })
            .subscribe({
                next: (data) => {
                    console.log(data);
                    // console.log(this.centerId);
                    Swal.fire({
                        title: this.lang === 'ltr' ? 'Good job' : 'أحسنت',
                        text:
                            this.lang === 'ltr'
                                ? 'request Sent'
                                : 'تم أرسال طلبك بنجاح',
                        icon: 'success',
                    });
                },
                error: (err) => {
                    console.error(err);
                    Swal.fire({
                        title:
                            this.lang === 'ltr' ? 'Try Again!' : 'حاول مجددا!',
                        text: err.message,
                        icon: 'error',
                    });
                },
            });
    }

    onSubmit() {
        if (this.requestForm.valid) {
            this.postCall(this.requestForm.value);
            console.log(this.requestForm.value);
        } else {
            Swal.fire({
                title: this.lang === 'ltr' ? 'Try Again!' : 'حاول مجددا!',
                text:
                    this.lang === 'ltr'
                        ? 'Enter Valid Data'
                        : 'أدخل بيانات صحيحة',
                icon: 'error',
            });
        }
    }
}
