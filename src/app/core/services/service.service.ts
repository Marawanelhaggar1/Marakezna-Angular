import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../models/service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServiceService {
    lang: string;

    constructor(private _http: HttpClient) {
        if (JSON.parse(localStorage.getItem('lang')!) == 'rtl') {
            this.lang = 'Ar';
        } else {
            this.lang = 'En';
        }
    }
    get(): Observable<{ data: Service[] }> {
        return this._http.get<{ data: Service[] }>(
            `https://marakezna.com/laravel/public/api/service?lang=${this.lang}`
        );
    }

    getFeatured(): Observable<{ data: Service[] }> {
        return this._http.get<{ data: Service[] }>(
            `https://marakezna.com/laravel/public/api/service?lang=${this.lang}`
        );
    }
}
