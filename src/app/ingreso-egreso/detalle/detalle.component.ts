import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit {

  ingresosEgresos$: Observable<IngresoEgreso[]> = of([]);

  constructor( 
    private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosEgresos$ = this.store.select('ingresosEgresos').pipe(
      map( (data:any)=>{
        console.log(data);
        return data.items;
      })
    )
  }

  borrar( uid:string){
    console.log(uid);
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then( ()=>{
        Swal.fire('Borrado', 'Item borrado', 'success');
      })
      .catch( error=>{
        Swal.fire('Error', error.message , 'error');
      })
  }

}
