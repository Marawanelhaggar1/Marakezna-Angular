import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { About } from '../models/about';
import { Insurance } from '../models/insurance';

@Injectable({
    providedIn: 'root',
})
export class AboutService {
    lang: string;

    constructor(private _http: HttpClient) {
        if (JSON.parse(localStorage.getItem('lang')!) == 'rtl') {
            this.lang = 'Ar';
        } else {
            this.lang = 'En';
        }
    }
    get(): Observable<{ data: About[] }> {
        return this._http.get<{ data: About[] }>(
            `https://marakezna.com/public/api/about/us?lang=${this.lang}`
        );
    }

    getInsurance(): Observable<{ data: Insurance[] }> {
        return this._http.get<{ data: Insurance[] }>(
            `https://marakezna.com/public/api/insurance?lang=${this.lang}`
        );
    }
}
