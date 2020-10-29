import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { VentasPedidoService } from '../services/ventas/ventas-pedido.service';
declare function init_plugins();

@Component({
  selector: 'app-documentoscliente',
  templateUrl: './documentoscliente.component.html',
  styleUrls: ['./documentoscliente.component.css']
})
export class DocumentosclienteComponent implements OnInit {

  constructor(private aroute: ActivatedRoute, public pedidoSVC: VentasPedidoService) { }
  token;

  ngOnInit() {
    init_plugins();
    this.token = this.aroute.snapshot.paramMap.get('token')
    this.getOC();
  }

  getOC(){
    this.pedidoSVC.getValidacion(this.token).subscribe(data=>{
      console.log(data);
      this.pedidoSVC.pedidoCliente = data[0];
      this.pedidoSVC.updateOrdenCarga(this.pedidoSVC.pedidoCliente.IdPedido).subscribe(resp=>{
        console.log(resp);
      })
    })
  }

}
