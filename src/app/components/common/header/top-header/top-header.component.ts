import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Settings } from 'src/app/core/models/settings';
import { User } from 'src/app/core/models/user';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
    selector: 'app-top-header',
    templateUrl: './top-header.component.html',
    styleUrls: ['./top-header.component.scss'],
})
export class TopHeaderComponent implements OnInit {
    user?: User | null;
    lang?: string;
    setting?: Settings;

    constructor(
        public router: Router,
        public _cookie: CookieService,
        private _settingService: SettingsService
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('lang')) {
            this.lang = JSON.parse(localStorage.getItem('lang')!);
        } else {
            this.lang = 'ltr';
        }

        if (this._cookie.get('user')) {
            this.user = JSON.parse(this._cookie.get('user'));
        } else {
            this.user = null;
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

    setArabic() {
        let language = 'rtl';
        localStorage.setItem('lang', JSON.stringify(language));
        window.location.reload();
    }

    setEnglish() {
        let language = 'ltr';
        localStorage.setItem('lang', JSON.stringify(language));
        window.location.reload();
    }

    logout() {
        this._cookie.delete('user');
        this.sendToHome();
    }

    sendToHome() {
        window.location.href = '/';
    }
}
