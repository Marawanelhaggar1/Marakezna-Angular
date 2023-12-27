import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Centers } from '../models/centers';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CentersService {
    lang: string;

    constructor(private _http: HttpClient) {
        if (JSON.parse(localStorage.getItem('lang')!) == 'rtl') {
            this.lang = 'Ar';
        } else {
            this.lang = 'En';
        }
    }
    get(): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `http://pp.etqanis.com/public/api/center?lang=${this.lang}`
        );
    }

    getById(id: number): Observable<{ data: Centers }> {
        return this._http.get<{ data: Centers }>(
            `http://pp.etqanis.com/public/api/center/${id}?lang=${this.lang}`
        );
    }

    getByArea(areaId: number): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `http://pp.etqanis.com/public/api/center/area/${areaId}?lang=${this.lang}`
        );
    }
}
