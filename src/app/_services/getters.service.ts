import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { error } from 'util';

@Injectable({ providedIn: 'root' })
export class GetterServices {


    constructor(private http: HttpClient) {
    }



    listaPessoas() {
        return this.http.get<any>(`http://127.0.0.1:8000/api/listaPessoas`)
            .pipe(map((user) => {
                if (user != null) {
                    return user;
                } else {
                    return error('Username or password is incorrect');
                }
            }));
    }

    listaLogs() {
        return this.http.get<any>(`http://127.0.0.1:8000/api/listaLogs`)
            .pipe(map((user) => {
                if (user != null) {
                    return user;
                } else {
                    return error('Username or password is incorrect');
                }
            }));
    }
    listaUrnas() {
        return this.http.get<any>(`http://127.0.0.1:8000/api/listaUrnas`)
            .pipe(map((user) => {
                if (user != null) {
                    return user;
                } else {
                    return error('Username or password is incorrect');
                }
            }));
    }

    buscarPessoa(id) {
        return this.http.get<any>(`http://127.0.0.1:8000/api/buscarPessoa/` + id)
            .pipe(map((user) => {
                if (user !== null) {
                    return user;
                } else {
                    return error('Username or password is incorrect');
                }
            }));
    }
    apagarPessoa(id) {
        return this.http.get<any>(`http://127.0.0.1:8000/api/apagarPessoa/` + id)
            .pipe(map((user) => {
                if (user !== null) {
                    return user;
                } else {
                    return error('Username or password is incorrect');
                }
            }));
    }
}
