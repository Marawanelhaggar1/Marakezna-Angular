import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/core/models/service';
import { Settings } from 'src/app/core/models/settings';
import { ServiceService } from 'src/app/core/services/service.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    lang?: string;
    setting?: Settings;
    service!: Service[];

    constructor(
        public router: Router,
        private _settingService: SettingsService,
        private _serviceService: ServiceService
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
        this.getService();
        this.getSettings();
    }

    getSettings() {
        this._settingService.get().subscribe({
            next: (data) => {
                this.setting = data.data[data.data.length - 1];
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    getService() {
        this._serviceService.getFeatured().subscribe({
            next: (data) => {
                this.service = data.data;
            },
            error: (err) => {
                console.error(err);
            },
        });
    }
}
