import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2'
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loading$:Observable<boolean> = of(false);

  constructor( private fb: FormBuilder,
              private authService: AuthService,
              private router:Router,
              private store: Store<AppState>) {
              
               }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [ '', [ Validators.required, Validators.email]],
      password: [ '', Validators.required]
    })
  
    /*
    this.store.select('ui').subscribe( ui =>{
      this.loading = ui.isLoading ;
      console.log("cargando ....")
    })
    */

    this.loading$ = this.store.select('ui').pipe(
      map( ui =>{
        console.log("cargando ....")

        return ui.isLoading;
      })
    )
  }

  loginUsuario(){

    if(this.loginForm.invalid) return;

    this.store.dispatch( ui.isLoading());

    /*
    Swal.fire({
      title: 'Autenticando...',
      didOpen: () => {
        Swal.showLoading()
      }
      
    })
    */

    const {email, password} = this.loginForm.value;

    this.authService.loginUsuario( email, password)
      .then( data =>{
        console.log(data);
        //Swal.close();
        this.store.dispatch( ui.stopLoading())
        this.router.navigate(['/']);
      } ).catch( error =>{
        console.log(error);
        this.store.dispatch( ui.stopLoading())

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
      })
  }

}
