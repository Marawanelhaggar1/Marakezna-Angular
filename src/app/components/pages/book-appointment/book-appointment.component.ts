import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
// import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { Doctor } from 'src/app/core/models/doctor';
import { UserService } from 'src/app/core/services/auth-services.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { DoctorService } from 'src/app/core/services/doctor.service';

@Component({
    selector: 'app-book-appointment',
    templateUrl: './book-appointment.component.html',
    styleUrls: ['./book-appointment.component.scss'],
})
export class BookAppointmentComponent {
    lang?: string;
    alert?: string;
    alertStatus!: string;
    appointmentForm: FormGroup;
    sub: any;
    schedule: any;
    doctor!: Doctor;
    scheduleId!: number;
    user!: any;
    siteKey = '6LdICtkoAAAAAD6AtUM08O4U-DS_5HIVfSY__Py3';

    constructor(
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _ActivatedRoute: ActivatedRoute,
        private _doctorService: DoctorService,
        private _bookingService: BookingService,
        private _userService: UserService,
        private _Cookie: CookieService
    ) {
        this.appointmentForm = this._formBuilder.group({
            patient_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            payment: ['', [Validators.required]],
            time: ['00:00', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.appointmentForm.valid) {
            this.sendBooking();
        } else {
            this.alertStatus = 'warning';
            this.alert =
                this.lang === 'ltr'
                    ? 'Please enter valid Data'
                    : 'أرجوك أدخل بيانات صحيحة';
        }
    }

    ngOnInit() {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.sub = this._ActivatedRoute.params.subscribe((params) => {
            this.scheduleId = params['id'];
            this.getScheduleById(this.scheduleId);
        });
    }

    getScheduleById(id: number) {
        return this._doctorService.getSchedule(id).subscribe((data) => {
            this.schedule = data.data;
            console.log(this.schedule);

            this.getDoctorById(this.schedule.doctor_id);
        });
    }

    getDoctorById(id: number) {
        return this._doctorService.getById(id).subscribe((data) => {
            this.doctor = data.data;
        });
    }

    sendBooking() {
        // this.getUser();
        let booking = {
            doctor_id: this.doctor.id,
            date: this.schedule.date,
            status: 'submitted',
            health_center_id: this.schedule.center_id,
            ...this.appointmentForm.value,
        };
        console.log(booking);
        return this._bookingService.postBooking(booking).subscribe({
            next: (data) => {
                Swal.fire({
                    title: this.lang === 'ltr' ? 'Good job' : 'أحسنت',
                    text:
                        this.lang === 'ltr'
                            ? 'Appointment Successfully Booked'
                            : 'تم الحجز بنجاح',
                    icon: 'success',
                });
            },
            error: (err) => {
                Swal.fire({
                    title: this.lang === 'ltr' ? 'Try Again!' : 'حاول مجددا!',
                    text: err.error.message,
                    icon: 'error',
                });
            },
        });
    }

    // getUser() {
    //     const userCookie = this._Cookie.get('user');

    //     if (userCookie) {
    //         const userData = JSON.parse(userCookie);
    //         if (userData && userData.data && userData.data.token) {
    //             // Proceed with the logic
    //             console.log('g');
    //             this._userService.get().subscribe({
    //                 next: (data) => {
    //                     console.log(data);
    //                     // this.user = data;
    //                 },
    //                 error: (err) => {
    //                     console.log(err);
    //                 },
    //             });
    //         } else {
    //             this.alertStatus = 'danger';
    //             this.alert =
    //                 this.lang === 'ltr'
    //                     ? 'Please Login First'
    //                     : 'من فضلك سجل الدخول أولا';
    //             setTimeout(() => {
    //                 this._router.navigate(['/login']);
    //             }, 3000);
    //         }
    //     } else {
    //         // Handle the case where the 'user' cookie doesn't exist
    //         this.alertStatus = 'danger';
    //         this.alert =
    //             this.lang === 'ltr'
    //                 ? 'Please Login First'
    //                 : 'من فضلك سجل الدخول أولا';
    //         setTimeout(() => {
    //             this._router.navigate(['/login']);
    //         }, 3000);
    //     }
    // }

    // getTheDate(targetDay: string) {
    //     // Validate the target day input
    //     const validDays =
    //         this.lang == 'ltr'
    //             ? [
    //                   'Sunday',
    //                   'Monday',
    //                   'Tuesday',
    //                   'Wednesday',
    //                   'Thursday',
    //                   'Friday',
    //                   'Saturday',
    //               ]
    //             : [
    //                   'الأحد',
    //                   'الأثنين',
    //                   'الثلاثاء',
    //                   'الأربعاء',
    //                   'الخميس',
    //                   'الجمعه',
    //                   'السبت',
    //               ];
    //     if (!validDays.includes(targetDay)) {
    //         console.error(
    //             'Invalid target day. Please provide a valid day name (e.g., Sunday, Monday, etc.).'
    //         );
    //         return;
    //     }

    //     // Get the current date
    //     const today = new Date();

    //     // Calculate the next occurrence of the target day
    //     const targetIndex = validDays.indexOf(targetDay);
    //     const nextOccurrence = new Date(today);
    //     nextOccurrence.setDate(
    //         today.getDate() + ((targetIndex + 7 - today.getDay()) % 7)
    //     );
    //     console.log(nextOccurrence);
    //     // Format the date as "dd/mm/yyyy"
    //     const options: any = {
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //     };
    //     const formattedDate = nextOccurrence.toLocaleDateString(
    //         'zh-Hans-CN',
    //         options
    //     );
    //     this.schedule.date = formattedDate;
    // }

    public resolved(captchaResponse: string): void {
        console.log(`Resolved captcha with response: ${captchaResponse}`);
    }

    public onError(errorDetails: RecaptchaErrorParameters): void {
        console.log(`reCAPTCHA error encountered; details:`, errorDetails);
    }
}
