import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor';

@Injectable({
    providedIn: 'root',
})
export class DoctorService {
    lang: string;

    constructor(private _http: HttpClient) {
        if (JSON.parse(localStorage.getItem('lang')!) == 'rtl') {
            this.lang = 'Ar';
        } else {
            this.lang = 'En';
        }
    }
    get(): Observable<{ data: Doctor[] }> {
        return this._http.get<{ data: Doctor[] }>(
            `https://marakezna.com/public/api/doctors?lang=${this.lang}`
        );
    }

    getPaginate(page: number): Observable<{
        data: Doctor[];
        meta: { last_page: number; current_page: number };
        links: { next: string; prev: string };
    }> {
        return this._http.get<{
            data: Doctor[];
            meta: { last_page: number; current_page: number };
            links: { next: string; prev: string };
        }>(
            `https://marakezna.com/public/api/doctors/paginate?lang=${this.lang}&page=${page}`
        );
    }

    getFeatured(): Observable<{ data: Doctor[] }> {
        return this._http.get<{ data: Doctor[] }>(
            `https://marakezna.com/public/api/doctors/featured?lang=${this.lang}`
        );
    }

    getById(id: number): Observable<{ data: Doctor }> {
        return this._http.get<{ data: Doctor }>(
            `https://marakezna.com/public/api/doctors/${id}?lang=${this.lang}`
        );
    }

    getByCenter(centerId: number): Observable<{ data: Doctor[] }> {
        return this._http.get<{ data: Doctor[] }>(
            `https://marakezna.com/public/api/doctors/center/${centerId}?lang=${this.lang}`
        );
    }

    getBySpecialty(specialtyId: number): Observable<{ data: Doctor[] }> {
        return this._http.get<{ data: Doctor[] }>(
            `https://marakezna.com/public/api/doctors/specialty/${specialtyId}?lang=${this.lang}`
        );
    }

    getByCenterAndSpecialty(
        centerId: number,
        specialtyId: number
    ): Observable<{ data: Doctor[] }> {
        return this._http.get<{ data: Doctor[] }>(
            `https://marakezna.com/public/api/doctors/${centerId}/${specialtyId}?lang=${this.lang}`
        );
    }

    getDoctorSchedule(id: number): Observable<{ data: any[] }> {
        return this._http.get<{ data: any[] }>(
            `https://marakezna.com/public/api/doctor/schedule/doc/${id}?lang=${this.lang}`
        );
    }

    getSchedule(id: number): Observable<{ data: any }> {
        return this._http.get<{ data: any[] }>(
            `https://marakezna.com/public/api/doctor/schedule/${id}?lang=${this.lang}`
        );
    }
}
