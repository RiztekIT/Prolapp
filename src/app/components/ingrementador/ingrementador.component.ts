import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ingrementador',
  templateUrl: './ingrementador.component.html',
  styles: []
})
export class IngrementadorComponent implements OnInit {

  @ViewChild('txtProgress', {static: false}) txtProgress: ElementRef;
  @Input() leyenda: string = 'Leyenda';
  @Input() porcentaje = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChanges( newValue: number){


    // let elemHTML: any = document.getElementsByName('porcentaje')[0];



    if (newValue>=100){
      this.porcentaje = 100;
    } else if (newValue <= 0) {
      this.porcentaje = 0;
    }else{
      this.porcentaje = newValue;
    }

    // elemHTML.value = this.porcentaje;
    this.txtProgress.nativeElement.value = this.porcentaje;


    this.cambioValor.emit( this.porcentaje );
  }

  cambiarValor( valor: number ){

    if (this.porcentaje >= 100 && valor > 0 ) {
      this.porcentaje = 100;
      return;
    }
    if (this.porcentaje <= 0 && valor < 0 ) {
      this.porcentaje = 0;
      return;
    }
    this.porcentaje = this.porcentaje + valor;

    this.cambioValor.emit( this.porcentaje );

    this.txtProgress.nativeElement.focus();
  }

}
