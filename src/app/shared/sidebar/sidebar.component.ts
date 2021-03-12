import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  user$:Observable<Usuario> = of();

  constructor( private authService: AuthService,
              private router:Router,
              private store:Store<AppState>) { }

  ngOnInit(): void {
    this.user$ = this.store.select('user').pipe(
      filter( ( {user})=> user!=null ),
      map( ({ user })=>{
        return user;
      })
    )
  }

  logout(){
    this.authService.logout()
      .then( ()=>{
        this.router.navigate(['/login'])
      })
  }
}
