import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/core/models/service';
import { ServiceService } from 'src/app/core/services/service.service';

@Component({
    selector: 'app-services-page-two',
    templateUrl: './services-page-two.component.html',
    styleUrls: ['./services-page-two.component.scss'],
})
export class ServicesPageTwoComponent implements OnInit {
    lang?: string;
    services?: Service[];
    constructor(private _serviceService: ServiceService) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.getService();
    }

    getService() {
        return this._serviceService.get().subscribe({
            next: (res) => {
                this.services = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
