import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<boolean>(false);
    public currentUser$ = this.currentUserSubject.asObservable();

    private hostUrl = 'http://localhost:8080/';

    constructor(private http: HttpClient) {
        this.checkAuthStatus();
    }

    checkAuthStatus(): void {
        this.http.get(`${this.hostUrl}auth/status`, { withCredentials: true })
            .pipe(
                map(response => !!response),
                catchError(() => {
                    this.currentUserSubject.next(false);
                    return [];
                })
            )
            .subscribe(isAuthenticated => this.currentUserSubject.next(isAuthenticated));
    }

    register(username: string, email: string, password: string): Observable<any> {
        return this.http.post(`${this.hostUrl}auth/register`, { username, email, password }, { withCredentials: true })
            .pipe(
                tap(response => {
                    this.currentUserSubject.next(true);
                }),
                catchError(error => {
                    this.currentUserSubject.next(false);
                    throw error;
                })
            );
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post(`${this.hostUrl}auth/login`, { email, password }, { withCredentials: true })
            .pipe(
                tap(response => {
                    this.currentUserSubject.next(true);
                }),
                catchError(error => {
                    this.currentUserSubject.next(false);
                    throw error;
                })
            );
    }

    logout(): Observable<any> {
        return this.http.post(`${this.hostUrl}auth/logout`, {}, { withCredentials: true })
            .pipe(
                tap(response => {
                    this.currentUserSubject.next(false);
                }),
                catchError(error => {
                    this.currentUserSubject.next(false);
                    throw error;
                })
            );
    }
}
