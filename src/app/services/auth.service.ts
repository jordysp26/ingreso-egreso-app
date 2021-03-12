import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingreoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: Usuario;

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  get user() {
    return { ...this._user };
  }

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      if (fuser) {
        console.log(fuser);
        this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .pipe(first())
          .subscribe((fUser: any) => {
            const user = Usuario.fromFirestore(fUser);
            this._user = user;
            this.store.dispatch(authActions.setUser({ user: user }));
          });
      } else {
        console.log('Llamar unset de user');
        this._user = null;
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingreoEgresoActions.unSetItems());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((fuser) => {
        const newUser = new Usuario(fuser.user.uid, nombre, email);

        return this.firestore.doc(`${newUser.uid}/usuario`).set({ ...newUser });
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map((fuser) => {
        return fuser != null;
      })
    );
  }
}
