import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Centers } from 'src/app/core/models/centers';
import { CentersService } from 'src/app/core/services/centers.service';

@Component({
    selector: 'app-center-carousel',
    templateUrl: './center-carousel.component.html',
    styleUrls: ['./center-carousel.component.scss'],
})
export class CenterCarouselComponent {
    lang?: string;
    centers?: Centers[];
    constructor(private _centerService: CentersService) {}
    customOptions: OwlOptions = {
        items: 3,
        nav: true,
        loop: true,
        dots: false,
        autoplay: true,

        smartSpeed: 1000,
        navText: [
            '<i class="flaticon-011-chevron-1"></i>',
            '<i class="flaticon-010-chevron"></i>',
        ],
    };
    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.getCenters();
    }

    getCenters() {
        return this._centerService
            .get()
            .subscribe((data) => (this.centers = data.data));
    }
}
