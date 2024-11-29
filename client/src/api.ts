import { EventEmitter } from './event-emitter';

export const unauthorizedEvent = new EventEmitter<void>();

class ApiError extends Error {
    detail: string;

    constructor(detail: string) {
        super(detail);
        this.name = 'ApiError';
        this.detail = detail;
    }
}

let hostUrl = 'http://localhost:8080/';

export async function request(
    method: string = 'GET',
    endpoint: string,
    body: any = null,
    queryParameters: Record<string, string> | null = null
): Promise<any> {
    let url = hostUrl + endpoint;

    if (queryParameters) {
        url += '?' + new URLSearchParams(queryParameters);
    }

    let options: RequestInit = {
        method: method,
    };

    if (body) {
        options.headers = {
            'Content-Type': 'application/json'
        };
        options.body = JSON.stringify(body);
    }

    let response = await fetch(url, options);

    if (response.status === 401) {
        unauthorizedEvent.emit();
    }

    if (!response.ok) {
        throw new ApiError(await response.text());
    }

    let data = await response.json();
    return data;
}

export async function register(username: string, email: string, password: string) {
    return request('POST', 'auth/register', { username, email, password });
}

export async function login(email: string, password: string) {
    return request('POST', 'auth/login', { email, password });
}

export async function logout() {
    return request('POST', 'auth/logout');
}
