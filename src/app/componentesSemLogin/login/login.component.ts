import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Validacoes } from './validacoes';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material';
import { BottomSheetOverviewExampleSheet } from './bottomSheet';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  loginForm;
  param1: string;
  encPassword: string;
  resultadoEncriptacao: string;
  hash: string;
  connection: any;
  messages;
  static connection: any;

  get CPF() { return this.loginForm.get('CPF'); }
  get Senha() { return this.loginForm.get('Senha'); }
  get Lembrar() { return this.loginForm.get('Lembrar'); }
  get f() { return this.loginForm.controls; }


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private socket: Socket,
    private _bottomSheet: MatBottomSheet,
  ) {

    this.loginForm = this.formBuilder.group({
      CPF: ['', Validators.compose([Validators.required, Validators.minLength(11), Validacoes])],
      Senha: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      Lembrar: false
    });
    if (localStorage.getItem('lembrar')) {
      this.loginForm.controls.CPF.setValue(localStorage.getItem('lembrar'));
      this.loginForm.controls.Lembrar.setValue(true);
    }

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['']);
    }
  }

  ngOnInit() {
  }

  getMessages() {
    this.socket.emit("login", 'mensagem1' + this.f.CPF.value);
    let observable = new Observable(observer => {
      this.socket.on('login', (data) => {
        this._bottomSheet.open(BottomSheetOverviewExampleSheet, {
          data: { mensagem: data },
        });
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  lerDigital() {
    if (this.CPF.valid) {
      this.connection = this.getMessages().subscribe(message => {
      });
    }
    else {
      this.snackBar.open('Por favor preencha o CPF', 'Fechar', {
        duration: 2000
      });
    }
  }

  cadastrar(event) {
    event.preventDefault();
    this.router.navigate(['registrar']);
  }


  onSubmit() {
    this.resultadoEncriptacao = CryptoJS.SHA256(this.f.Senha.value).toString();
    this.hash = CryptoJS.SHA256(this.f.Senha.value);

    this.authenticationService.login(this.f.CPF.value, this.resultadoEncriptacao)
      .pipe(first())
      .subscribe(
        data => {
          if (this.f.Lembrar.value === true) {
            localStorage.setItem('lembrar', this.f.CPF.value);
          } else {
            localStorage.removeItem('lembrar');
          }
          if (this.route.snapshot.queryParamMap.get('returnUrl')) {
            this.router.navigate([this.route.snapshot.queryParamMap.get('returnUrl')]);
          } else {
            this.router.navigate(['home']);
          }
        },
        error => {
          this.snackBar.open('CPF ou Senha incorreto', 'Fechar', {
            duration: 2000
          });
        });
  }
}