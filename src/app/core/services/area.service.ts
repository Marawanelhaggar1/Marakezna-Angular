import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Areas } from '../models/areas';

@Injectable({
    providedIn: 'root',
})
export class AreaService {
    lang: string;

    constructor(private _http: HttpClient) {
        if (JSON.parse(localStorage.getItem('lang')!) == 'rtl') {
            this.lang = 'Ar';
        } else {
            this.lang = 'En';
        }
    }
    get(): Observable<{ data: Areas[] }> {
        return this._http.get<{ data: Areas[] }>(
            `https://marakezna.com/public/api/area?lang=${this.lang}`
        );
    }

    getSubArea(): Observable<{ data: Areas[] }> {
        return this._http.get<{ data: Areas[] }>(
            `https://marakezna.com/public/api/sub/area?lang=${this.lang}`
        );
    }

    getSubAreaByArea(id: number): Observable<{ data: Areas[] }> {
        return this._http.get<{ data: Areas[] }>(
            `https://marakezna.com/public/api/sub/area/area/${id}?lang=${this.lang}`
        );
    }
}
