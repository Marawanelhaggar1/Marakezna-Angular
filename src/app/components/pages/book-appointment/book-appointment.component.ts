import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
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
            time: ['', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.appointmentForm.valid) {
            this.sendBooking();
        } else {
            alert('Please enter valid Data');
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
        this.getUser();
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
        let booking = {
            doctor_id: this.doctor.id,
            date: this.schedule.date,
            status: 'submitted',
            user_id: this.user.id,
            ...this.appointmentForm.value,
        };
        console.log(booking);
        return this._bookingService.postBooking(booking).subscribe({
            next: (data) => {
                console.log(data);
            },
            error: (err) => {
                // this._router.navigate(['/login']);
            },
        });
    }

    getUser() {
        // console.log(this._Cookie.get('user'));
        return this._userService.get().subscribe((data) => {
            console.log(data);
            this.user = data;
        });
    }

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
