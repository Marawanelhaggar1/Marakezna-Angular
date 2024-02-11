import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/core/models/service';
import { ServiceService } from 'src/app/core/services/service.service';

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
    lang?: string;
    services?: Service[];
    constructor(
        public router: Router,
        private serviceService: ServiceService
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.getService();
    }

    getService() {
        return this.serviceService.get().subscribe({
            next: (res) => {
                this.services = res.data;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
