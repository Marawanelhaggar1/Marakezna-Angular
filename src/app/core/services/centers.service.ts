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
            `https://marakezna.com/public/api/center?lang=${this.lang}`
        );
    }

    getById(id: number): Observable<{ data: Centers }> {
        return this._http.get<{ data: Centers }>(
            `https://marakezna.com/public/api/center/${id}?lang=${this.lang}`
        );
    }

    getByArea(areaId: number): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/area/${areaId}?lang=${this.lang}`
        );
    }

    getBySubArea(areaId: number): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/sub/area/${areaId}?lang=${this.lang}`
        );
    }

    getLabsAndScans(): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/scans/labs?lang=${this.lang}`
        );
    }

    getLabs(): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/category/lab?lang=${this.lang}`
        );
    }

    getScans(): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/category/scan?lang=${this.lang}`
        );
    }

    getLabsByArea(id: number): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/category/lab/area/${id}?lang=${this.lang}`
        );
    }
    getLabsBySubArea(id: number): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/category/lab/sub/area/${id}?lang=${this.lang}`
        );
    }

    getScansByArea(id: number): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/category/scan/area/${id}?lang=${this.lang}`
        );
    }

    getScansBySubArea(id: number): Observable<{ data: Centers[] }> {
        return this._http.get<{ data: Centers[] }>(
            `https://marakezna.com/public/api/center/category/scan/sub/area/${id}?lang=${this.lang}`
        );
    }
}
