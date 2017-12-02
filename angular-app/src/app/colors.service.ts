import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ColorsService {
  colors: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.colors = db.collection('colors').valueChanges();
  }  

  getColors() {
    return this.colors
  }
}
