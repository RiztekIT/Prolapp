import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TipoCambioService {

  constructor() {
  }
  
  TipoCambio: string;

  private tc = new Subject<any>();

  TC(){
    this.tc.next(this.TipoCambio);
  }
  
  getTc(): Observable<any>{
    // console.log('observable tipo de cambio');
    
    return this.tc.asObservable();
  }
  
  
}
