import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from 'src/app/core/models/settings';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    lang?: string;
    setting?: Settings;

    constructor(
        public router: Router,
        private _settingService: SettingsService
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }
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
}
