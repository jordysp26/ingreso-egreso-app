import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private firestore:AngularFirestore,
                private authService: AuthService) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso){
    console.log("Valor a guardar: ",ingresoEgreso);
    delete ingresoEgreso.uid;

    return this.firestore.doc( `${this.authService.user.uid}/ingresos-egresos`)
      .collection('items')
      .add( {...ingresoEgreso} )
  }

  initIngresosEgresosListener(uid:string): Observable<IngresoEgreso[]>{
    return this.firestore.collection<IngresoEgreso>(`${uid}/ingresos-egresos/items`)
    .snapshotChanges()
    .pipe(
      map(snapshot=>{
        return snapshot.map( doc=>{

          const data:IngresoEgreso = doc.payload.doc.data();

          return {
            uid: doc.payload.doc.id,
            ...data
          }
        });
      })
    );
  }

  borrarIngresoEgreso( uidItem:string ){

    const uid = this.authService.user.uid

    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete()
  }
}
