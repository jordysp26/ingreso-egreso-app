import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';


import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';


@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos:number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  ingresosEgresosSubs: Subscription;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [
    [0, 0]
    
  ];
  public doughnutChartType: ChartType = 'doughnut';

  constructor( private store:Store<AppState>) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store.select('ingresosEgresos')
      .subscribe( ({items})=>{
        this.generarEstadistica(items)
      })
  }

  generarEstadistica( items: IngresoEgreso[] ){
    console.log(items);
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.egresos = 0;
    this.ingresos = 0;
    items.forEach( item =>{
      if(item.tipo == 'ingreso'){
        this.totalIngresos += item.monto;
        this.ingresos ++;
      }else{
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    })

    this.doughnutChartData = [ [this.totalIngresos, this.totalEgresos]]
  }

  ngOnDestroy(): void {
   this.ingresosEgresosSubs.unsubscribe();
    
  }
}
