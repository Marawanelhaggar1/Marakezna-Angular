import { Component, OnInit } from '@angular/core';
import {
    ActivatedRoute,
    Router,
    NavigationStart,
    Params,
} from '@angular/router';
// import { Router,  } from '@angular/router';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { Booking } from 'src/app/core/models/booking';
import { Centers } from 'src/app/core/models/centers';
import { Doctor } from 'src/app/core/models/doctor';
import { Specialization } from 'src/app/core/models/specialization';
import { BookingService } from 'src/app/core/services/booking.service';
import { CentersService } from 'src/app/core/services/centers.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { SpecializationService } from 'src/app/core/services/specialization.service';

@Component({
    selector: 'app-book-doctors-page',
    templateUrl: './book-doctors-page.component.html',
    styleUrls: ['./book-doctors-page.component.scss'],
})
export class BookDoctorsPageComponent {
    lang?: string;
    docId: any;
    specialty?: Specialization;
    center?: Centers;
    doctors: Doctor[] = [];
    doctor?: Doctor;
    customOptions: OwlOptions = {
        items: 3,
        nav: true,
        loop: false,
        dots: false,

        smartSpeed: 1000,
        navText: [
            '<i class="flaticon-011-chevron-1"></i>',
            '<i class="flaticon-010-chevron"></i>',
        ],
    };
    specialtyId!: number;
    centerId!: number;

    daysOfTheWeek!: string[];
    sub!: any;
    alert?: string;
    alertStatus!: string;

    constructor(
        private _ActivatedRoute: ActivatedRoute,
        private _specialtyService: SpecializationService,
        private _centerService: CentersService,
        private _router: Router,
        private _doctorService: DoctorService,
        private _bookingService: BookingService
    ) {}

    ngOnInit() {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }

        if (this.lang == 'ltr') {
            this.daysOfTheWeek = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ];
        } else if (this.lang == 'rtl') {
            this.daysOfTheWeek = [
                'الأحد',
                'الأثنين',
                'الثلاثاء',
                'الأربعاء',
                'الخميس',
                'الجمعه',
                'السبت',
            ];
        }
        this.sub = Object.assign({}, this._ActivatedRoute.snapshot.queryParams);

        if (this.sub.doctor) {
            console.log('get doctor by doc id');

            this.getDoctorById(this.sub.doctor);
        } else if (this.sub.specialty && this.sub.center) {
            console.log('get doctor by specialty and center');

            // this.getSpecialtyById(this.sub.specialty);
            // this.getCenterById(this.sub.center);
            this.getDataByCenterAndSpecialty(
                this.sub.center,
                this.sub.specialty
            );
        } else if (this.sub.center && !this.sub.specialty) {
            console.log('get doctor by center');

            // this.getCenterById(this.sub.center);
            this.getDataByCenterId(this.sub.center);
        } else if (!this.sub.center && this.sub.specialty) {
            console.log('get doctor by specialty');

            // this.getSpecialtyById(this.sub.specialty);
            this.getDataBySpecialtyId(this.sub.specialty);
        } else {
            console.log('get doctor');
            this.getDoctor();
        }
        this.formatDate();

        this._router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                const currentParams = this._ActivatedRoute.snapshot.queryParams;

                this._ActivatedRoute.queryParams.subscribe(
                    (updatedParams: Params) => {
                        if (
                            !this.areParamsEqual(currentParams, updatedParams)
                        ) {
                            // URL parameters have changed, reload the window with the new parameters
                            const updatedUrl = this._router
                                .createUrlTree([], {
                                    queryParams: updatedParams,
                                    queryParamsHandling: 'merge',
                                })
                                .toString();
                            window.location.href = updatedUrl;
                        }
                    }
                );
            }
        });

        console.log(this.doctors);
    }

    areParamsEqual(params1: any, params2: any): boolean {
        // Compare the parameters to check if they are equal
        // Implement your own comparison logic here
        // For example, you can compare individual properties or stringify the objects and compare
        return JSON.stringify(params1) === JSON.stringify(params2);
    }

    getDoctorById(id: number) {
        return this._doctorService.getById(id).subscribe((data) => {
            this.doctors = [];

            this.doctor = data.data;
            this.doctors.push(this.doctor);
            this.formatDate();
        });
    }

    getDataBySpecialtyId(id: number) {
        return this._doctorService.getBySpecialty(id).subscribe((data) => {
            this.doctors = [];

            this.doctors = data.data;
            this.formatDate();
        });
    }

    getDataByCenterId(id: number) {
        return this._doctorService.getByCenter(id).subscribe((data) => {
            this.doctors = [];

            this.doctors = data.data;
            this.formatDate();
        });
    }

    getDataByCenterAndSpecialty(cenId: number, specId: number) {
        return this._doctorService
            .getByCenterAndSpecialty(cenId, specId)
            .subscribe((data) => {
                this.doctors = [];

                this.doctors = data.data;
                this.formatDate();
            });
    }

    getDoctor() {
        return this._doctorService.get().subscribe((data) => {
            this.doctors = [];

            this.doctors = data.data;

            console.log(this.doctors);
            this.formatDate();
        });
    }

    formatDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const options: any = { weekday: 'long' };
        const formatter =
            this.lang == 'rtl'
                ? new Intl.DateTimeFormat('ar-EG', options)
                : new Intl.DateTimeFormat('en-UK', options);
        const dayName = formatter.format(today);
        const tomorrowName = formatter.format(tomorrow);
        console.log(tomorrowName);
        const todayIndex = this.daysOfTheWeek.findIndex(
            (day) => day === dayName
        );

        for (const doc of this.doctors) {
            doc.doctorSchedule = doc.doctorSchedule.sort((a, b) => {
                const dayIndexA = this.daysOfTheWeek.findIndex(
                    (day) => day === a.date
                );
                const dayIndexB = this.daysOfTheWeek.findIndex(
                    (day) => day === b.date
                );

                const sortedIndexA = (dayIndexA - todayIndex + 7) % 7;
                const sortedIndexB = (dayIndexB - todayIndex + 7) % 7;

                return sortedIndexA - sortedIndexB;
            });

            doc.doctorSchedule.map((date) => {
                if (dayName == date.date) {
                    console.log(date);
                    date.date = this.lang == 'ltr' ? 'Today' : 'اليوم';
                } else if (date.date == tomorrowName) {
                    date.date = this.lang == 'ltr' ? 'Tomorrow' : 'غدا';
                }
            });

            console.log(doc);
        }
    }

    postCall(body: any) {
        return this._bookingService.requestCall(body).subscribe({
            next: (data) => {
                console.log(data);
                this.alertStatus = 'success';
                this.alert = 'request Sent';
            },
            error: (err) => {
                console.error(err);
                this.alertStatus = 'danger';
                this.alert = err;
            },
        });
    }
}
