import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Centers } from 'src/app/core/models/centers';
import { BookingService } from 'src/app/core/services/booking.service';
import { CentersService } from 'src/app/core/services/centers.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-center-details',
    templateUrl: './center-details.component.html',
    styleUrls: ['./center-details.component.scss'],
})
export class CenterDetailsComponent {
    lang?: string;
    center?: Centers;
    centerId!: number;
    sub?: any;

    constructor(
        private _ActivatedRoutes: ActivatedRoute,
        private _centerService: CentersService,
        private _bookingService: BookingService
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.sub = this._ActivatedRoutes.params.subscribe((params) => {
            this.centerId = params['id'];
            this.getCenterById(this.centerId);
        });
    }

    getCenterById(id: number) {
        return this._centerService.getById(id).subscribe((data) => {
            this.center = data.data;
            console.log(this.center);
        });
    }

    postService(body: any) {
        return this._bookingService.requestCall(body).subscribe({
            next: (data) => {
                console.log(data);
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
                    title: this.lang === 'ltr' ? 'Try Again!' : 'حاول مجددا!',
                    text:
                        this.lang === 'ltr'
                            ? 'Please Login First'
                            : 'من فضلك سجل الدخول أولا',
                    icon: 'error',
                });
            },
        });
    }

    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }
}
