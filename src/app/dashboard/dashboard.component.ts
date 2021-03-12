import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, first, switchMap, take } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as actions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs:Subscription;
  ingresosSubs: Subscription;

  constructor( private store: Store<AppState>,
                private ieService: IngresoEgresoService) { }

  ngOnInit(): void {

    /*
    this.userSubs = this.store.select('user').pipe(
      filter( auth => auth.user !=null),
      map( data=> data.user),
      switchMap( user => {
        console.log(user);
        return this.ieService.initIngresosEgresosListener(user.uid)
      })
    ).subscribe( user=>{
      console.log(user);
      this.ingresosSubs = this.ieService.initIngresosEgresosListener(user.uid)
        .pipe()
        .subscribe( (ingresosEgresosFB: IngresoEgreso[]) =>{
          console.log(ingresosEgresosFB);
          this.store.dispatch( actions.setItems( { items: ingresosEgresosFB }))
        })
    })
    */
    this.ingresosSubs = this.store.select('user').pipe(
      filter( auth => auth.user !=null),
      map( data=> data.user),
      switchMap( user => {
        console.log(user);
        return this.ieService.initIngresosEgresosListener(user.uid)
      })
    ).subscribe( (ingresosEgresosFB: IngresoEgreso[])=>{
        console.log(ingresosEgresosFB);
        this.store.dispatch( actions.setItems( { items: ingresosEgresosFB }))
        
    })

  }

  ngOnDestroy(): void {
    //this.userSubs.unsubscribe();
    this.ingresosSubs.unsubscribe();
  }

}
