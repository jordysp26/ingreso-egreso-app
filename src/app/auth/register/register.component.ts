import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { of, Observable } from 'rxjs';

import Swal from 'sweetalert2';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;
  loading$: Observable<boolean> = of(false);

  constructor( private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store:Store<AppState>) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: [ '', Validators.required],
      correo: [ '', [Validators.required, Validators.email]],
      password: [ '', Validators.required],

    })

    this.loading$ = this.store.select('ui').pipe(
      map( ui =>{
        console.log("cargando ....")

        return ui.isLoading;
      })
    )
  }

  crearUsuario(){

    if(this.registroForm.invalid) return;

    this.store.dispatch( ui.isLoading())

    /*
    Swal.fire({
      title: 'Creando cuenta...',
      didOpen: () => {
        Swal.showLoading()
      }
      
    })
    */

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password )
      .then( credenciales =>{
        console.log(credenciales);
        //Swal.close();
        this.store.dispatch( ui.stopLoading())
        this.router.navigate(['/dashboard'])
      }).catch( error =>{


        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
      });


  }
}
