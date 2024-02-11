import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private _Http: HttpClient, private _Cookie: CookieService) {}

    get(): Observable<User> {
        return this._Http.get<User>('https://pp.etqanis.com/public/api/user', {
            headers: {
                Authorization:
                    'Bearer ' + JSON.parse(this._Cookie.get('user')).data.token,
            },
        });
    }

    login(body: any): Observable<any> {
        return this._Http.post<any>(
            'https://pp.etqanis.com/public/api/auth/login',
            body
        );
    }

    register(body: any): Observable<User> {
        return this._Http.post<User>(
            'https://pp.etqanis.com/public/api/auth/register',
            body
        );
    }

    google(body: any): Observable<User> {
        return this._Http.post<User>(
            'https://pp.etqanis.com/public/api/auth/google',
            body
        );
    }

    forgot(body: any): Observable<User> {
        return this._Http.post<User>(
            'http://localhost:8000/public/api/auth/forget/password',
            body
        );
    }
}
