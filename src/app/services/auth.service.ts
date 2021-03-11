import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { first, map } from "rxjs/operators";
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
                public firestore: AngularFirestore,
                private store: Store<AppState>) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser=>{

      console.log(fuser?.uid);
      console.log(fuser?.email);

      if(fuser){
        console.log(fuser);
        this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().pipe( first())
          .subscribe( (fUser:any)=>{
            console.log(fUser);

            const user = Usuario.fromFirestore( fUser);
            this.store.dispatch( actions.setUser({ user: user }));
          })
      }else{
        console.log("Llamar unset de user");
        this.store.dispatch( actions.unSetUser());

      }

    })
  }
  
  crearUsuario( nombre:string, email:string, password:string){

    return this.auth.createUserWithEmailAndPassword( email, password)
            .then(fuser=>{
              const newUser = new Usuario(fuser.user.uid, nombre, email);

              return this.firestore.doc(`${newUser.uid}/usuario`)
                  .set({...newUser});

            });

  }

  loginUsuario( email:string, password:string){
    return this.auth.signInWithEmailAndPassword( email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fuser =>{
        return fuser!=null;
      })
    );
  }
}
