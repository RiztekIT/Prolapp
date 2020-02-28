import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nota-creditocxc',
  templateUrl: './nota-creditocxc.component.html',
  styleUrls: ['./nota-creditocxc.component.css']
})
export class NotaCreditocxcComponent implements OnInit {



  constructor( ) { 

    // this.service.listen().subscribe((m:any)=>{
    //   this.refreshProveedoresList();
    //   });
  }

    // listData: MatTableDataSource<any>;
  // displayedColumns : string [] = [ 'Calle', 'Colonia', 'CP', 'Ciudad', 'Estado','NumeroInterior', 'NumeroExterior', 'Options'];
  // @ViewChild(MatSort, null) sort : MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
  }

}
