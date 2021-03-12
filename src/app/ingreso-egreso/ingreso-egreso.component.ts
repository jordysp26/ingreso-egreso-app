import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Observable, of } from 'rxjs';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit {

  ingresoEgresoForm: FormGroup;

  tipo:string = 'ingreso';

  loading$: Observable<boolean> = of(false);

  constructor( private fb: FormBuilder,
                private ieService: IngresoEgresoService,
                private store:Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoEgresoForm = this.fb.group({
      descripcion: [ '' , Validators.required],
      monto: [ '', Validators.required ]
    });

    this.loading$ = this.store.select('ui').pipe(
      map( ui =>{
        console.log("cargando ....")

        return ui.isLoading;
      })
    )
  }

  guardar(){
    
    if(this.ingresoEgresoForm.invalid) return;
    
    this.store.dispatch( ui.isLoading())

    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo);

    this.ieService.crearIngresoEgreso(ingresoEgreso)
      .then( ()=> {
        Swal.fire('Registro creado', descripcion, 'success');
        this.ingresoEgresoForm.reset();
        this.store.dispatch( ui.stopLoading())

      }).catch( error =>{
        this.store.dispatch( ui.stopLoading())

        Swal.fire('Error', descripcion, 'error');

      })
  }

}
