import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { About } from '../models/about';

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
            `https://pp.etqanis.com/public/api/about/us?lang=${this.lang}`
        );
    }
}
