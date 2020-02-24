import { Component, OnInit } from '@angular/core';
import { UnidadMedidaService } from '../../../services/unidadmedida/unidad-medida.service';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent implements OnInit {

  constructor(private service: UnidadMedidaService) { }

  ngOnInit() {
    this.unidadMedida();
  }

  public listUM: Array<any> = [];

  unidadMedida() {
      this.listUM = [];
      this.service.unidadMedidaAPISAT().subscribe(data => {
        console.log(JSON.parse(data).data);
        for (let i = 0; i < JSON.parse(data).data.length; i++) {
          this.listUM.push(JSON.parse(data).data[i])
        }
        console.log(this.listUM);
      })
  }

}
