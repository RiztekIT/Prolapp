import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosServieService } from '../../../services/catalogos/usuarios-servie.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-checador',
  templateUrl: './checador.component.html',
  styleUrls: ['./checador.component.css']
})
export class ChecadorComponent implements OnInit {

  constructor(public usuarioservice: UsuariosServieService) { }

  displayedColumns : string [] = ['Usuario', 'Fecha', 'Token'];
  listData: MatTableDataSource<any>;
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  fecha1;

  ngOnInit() {
    this.getChecadas();

    this.fecha1 = new Date();
    
  }


  getChecadas(){
    this.usuarioservice.checadas().subscribe((data: any)=>{
      console.log(data);
      this.listData = new MatTableDataSource(data);
            this.listData.sort = this.sort;    
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Checadas por Pagina';
            this.applyFilter('');
    })
  }

  /* Metodo para el filtro de la tabla */
  applyFilter(filtervalue: string){  
    console.log(this.listData);
    
    this.listData.filterPredicate = (data, filter: string) => {
      
        return data.Nombre.toLowerCase().includes(filter);
      
      
    };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
  }

  filtrofecha(evento){
    console.log(evento.target.value);

    let date = evento.target.value;

    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const days = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    let dia;
    
    let mes;
    let año;
    let hora;
    let min;
    let seg;
    let fecha2;
    
    let fecha = new Date(date);

    
    dia = `${days[fecha.getDate()]}`;
    
    mes = `${months[fecha.getMonth()]}`;
    año = fecha.getFullYear();
    hora = fecha.getHours();
    min = fecha.getMinutes();
    seg = fecha.getSeconds();

    hora = '00';
    min = '00';
    seg = '00';

    fecha2 = año + '-' + mes + '-' + dia
    console.log(fecha);
    console.log(fecha2);

  



    this.usuarioservice.checadasfechas(fecha2).subscribe((data: any)=>{
      console.log(data);
      this.listData = new MatTableDataSource(data);
            this.listData.sort = this.sort;    
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Checadas por Pagina';
            this.applyFilter('');
    })
  }

}
