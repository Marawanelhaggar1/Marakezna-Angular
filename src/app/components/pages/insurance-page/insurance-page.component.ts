import { Component, OnInit } from '@angular/core';
import { Insurance } from 'src/app/core/models/insurance';
import { AboutService } from 'src/app/core/services/about.service';

@Component({
    selector: 'app-insurance-page',
    templateUrl: './insurance-page.component.html',
    styleUrls: ['./insurance-page.component.scss'],
})
export class InsurancePageComponent implements OnInit {
    lang?: string;
    constructor(private _insuranceService: AboutService) {}
    companies?: Insurance[];
    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.getInsurance();
    }

    getInsurance() {
        return this._insuranceService.getInsurance().subscribe({
            next: (data) => {
                this.companies = data.data;
            },
        });
    }
}
