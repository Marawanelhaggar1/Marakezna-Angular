import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/core/models/doctor';
import { DoctorService } from 'src/app/core/services/doctor.service';

@Component({
    selector: 'app-dentists',
    templateUrl: './dentists.component.html',
    styleUrls: ['./dentists.component.scss'],
})
export class DentistsComponent implements OnInit {
    lang?: string;
    doctors!: Doctor[];

    constructor(public router: Router, private _doctorService: DoctorService) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.getDoctors();
    }

    getDoctors() {
        return this._doctorService.getFeatured().subscribe({
            next: (data) => {
                this.doctors = data.data;
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    customOptions: OwlOptions = {
        nav: false,
        margin: 25,
        loop: true,
        dots: true,
        autoplay: true,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        navText: [
            '<i class="flaticon-011-chevron-1"></i>',
            '<i class="flaticon-010-chevron"></i>',
        ],
        responsive: {
            0: {
                items: 1,
            },
            515: {
                items: 2,
            },
            695: {
                items: 2,
            },
            935: {
                items: 3,
            },
            1200: {
                items: 3,
            },
        },
    };
}
