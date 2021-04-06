import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Output } from '@angular/core';
import { CalendarioService } from '../../services/calendario/calendario.service';
import { detalleCalendario } from '../../Models/calendario/detalleCalendario-model';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter,
} from 'angular-calendar';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddEditCalendarComponent } from './add-edit-calendar/add-edit-calendar.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { CompraService } from '../../services/compras/compra.service';
import Swal from 'sweetalert2';
import { CustomDateFormatter } from './custom-date-formatter.provider';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // to register french

registerLocaleData(localeEs);

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-angular-calendar',
  templateUrl: './angular-calendar.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./angular-calendar.component.css']
})
export class AngularCalendarComponent implements OnInit {

  constructor(private modal: NgbModal, private calendarioService: CalendarioService, private dialog: MatDialog, public comprasService: CompraService) {

    this.calendarioService.listen().subscribe((procedencia: any) => {
      // console.log(procedencia);   
      this.usuario = localStorage.getItem('ProlappSession');
      this.usuario = JSON.parse(this.usuario);
      this.verificarProcedencia(procedencia);
    });
 

  }

  db;

  ngOnInit() {
  
  }


  usuario: any;

  //arreglo de eventos
  events: CalendarEvent[] = []
  events2: CalendarEvent[] = []

  //procedencia(de donde se cargo el modulo)
  procedencia: string;
  //idCalendario
  idCalendario: number;


  verificarProcedencia(moduloProcedencia: string) {
    // console.warn(moduloProcedencia);

    switch (moduloProcedencia) {
      case ('Compras'):
        // console.log('VIENE DE COMPRAS');
        this.procedencia = 'Compras';
        this.cargarCalendario(moduloProcedencia);
        this.modulo = 'Compras';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      case ('Almacen'):
        this.procedencia = 'Almacen';
        this.cargarCalendario(moduloProcedencia);
        this.modulo = 'Almacen';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        // console.log('VIENE DE ALMACEN');
        break;
      case ('Calidad'):
        this.procedencia = 'Calidad';
        this.cargarCalendario(moduloProcedencia);
        // console.log('VIENE DE Calidad');
        this.modulo = 'Calidad';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      case ('Cxc'):
        this.procedencia = 'Cxc';
        this.cargarCalendario(moduloProcedencia);
        // console.log('VIENE DE Cxc');
        this.modulo = 'Cuentas por Cobrar';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      case ('CxP'):
        this.procedencia = 'CxP';
        this.cargarCalendario(moduloProcedencia);
        // console.log('VIENE DE CxP');
        this.modulo = 'Cuentas por Pagar';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      case ('Direccion'):
        this.procedencia = 'Direccion';
        this.cargarCalendario(moduloProcedencia);
        // console.log('VIENE DE Direccion');
        this.modulo = 'Direccion';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      case ('Importacion'):
        this.procedencia = 'Importacion';
        this.cargarCalendario(moduloProcedencia);
        // console.log('VIENE DE Importacion');
        this.modulo = 'Importacion';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      case ('Trafico'):
        this.procedencia = 'Trafico';
        this.cargarCalendario(moduloProcedencia);
        // console.log('VIENE DE Trafico');
        this.modulo = 'Trafico';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      case ('Ventas'):
        this.procedencia = 'Ventas';
        this.cargarCalendario(moduloProcedencia);
        // console.log('VIENE DE Ventas');
        this.modulo = 'Ventas';
        this.area = 'Calendario'
        this.obtenerPrivilegios();
        break;
      default:
        this.procedencia = 'ninguno'
        // console.log('Ninguno corresponde');
        break;

    }

  }

    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = '';
    area = '';
  
    //^ VARIABLES DE PERMISOS
    Agregar: boolean = false;
    Borrar: boolean = false;
    //^ VARIABLES DE PERMISOS
  
  
    obtenerPrivilegios() {
      let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
      // console.log(arrayPermisosMenu);
      let arrayPrivilegios: any;
      try {
        arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
        // console.log(arrayPrivilegios);
        arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
        // console.log(arrayPrivilegios);
        this.privilegios = [];
        arrayPrivilegios.privilegios.forEach(element => {
          this.privilegios.push(element.nombreProceso);
          this.verificarPrivilegio(element.nombreProceso);
        });
        // console.log(this.privilegios);
      } catch {
        // console.log('Ocurrio algun problema');
      }
    }
  
    verificarPrivilegio(privilegio) {
      switch (privilegio) {
        case ('Agregar Evento'):
          this.Agregar = true;
          break;
        case ('Borrar Evento'):
          this.Borrar = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****
  



  //Obtener informacion Calendario Compras
  cargarCalendario(modulo: string) {
    // console.log('USUARIO');
    // console.log(this.usuario.user);
    // console.log(modulo);
    // console.log('USUARIO');
    // let usuario = 'Ramon';
    this.calendarioService.getCalendarioComprasUsuarioModulo(this.usuario.user, modulo).subscribe(dataCalendario => {
      if (dataCalendario.length > 0) {
        this.idCalendario = +dataCalendario[0].IdCalendario;
        // console.log('----------------ID CALENDARIO-----------');
        // console.log(this.idCalendario);
        // console.log(dataCalendario);


        this.events = [];
        this.events2 = [];
        this.calendarioService.getDetallesCalendarioId(dataCalendario[0].IdCalendario).subscribe(dataDC => {

          for (let i = 0; i < dataDC.length; i++) {
            //     //objeto eveto
            let event: any;
            event = [];
            let colorBD: any = {
              color: {
                primary: dataDC[i].Color,
                secondary: dataDC[i].Color,
              }
            };
            // console.log('************************');
            event.start = startOfDay(new Date(dataDC[i].Start));
            event.end = endOfDay(new Date(dataDC[i].Endd));
            //fecha actual
            let fa = new Date().getMonth();
            //fecha inicial
            let fi = event.start.getMonth();
            //fecha final
            let ff = event.end.getMonth();
            // console.log(fa + 'fa');
            // console.log(fi + 'fi');
            // console.log(ff + 'ff');
            event.id = dataDC[i].IdDetalleCalendario;
            event.title = dataDC[i].Title;
            event.color = colorBD.color;
            event.actions = this.actions;
            event.folio = dataDC[i].Folio;
            event.documento = dataDC[i].Documento;
            event.descripcion = dataDC[i].Descripcion;
            if (fa == fi) {
              // console.log('Hacer el push a eventos');
              this.events2.push(event);
            } else if (fi < fa && ff >= fa) {
              // console.log('fecha inicial menor y fecha final mayor o igual');
              this.events2.push(event);
            }


            // console.log('************************');



            this.events.push(event);

            this.refresh.next();


            ///////////////

          }
          // console.log(this.events);
        })
      } else {
        // console.log('Calendario Invalido');
        this.events = [];
        this.events2 = [];
        this.refresh.next();
      }

    })
    // this.events = [
    //   {
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     title: 'EVENTO COMPRAS',
    //     color: colors.yellow,
    //     actions: this.actions,
    //   },
    //   {
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     title: 'EVENTO COMPRAS',
    //     color: colors.yellow,
    //     actions: this.actions,
    //   }
    // ];



  }

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  //EDITAR Y ELIMINAR FECHA
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // console.log(event);
        this.calendarioService.getDetallesCalendarioIdDetalle(+event.id).subscribe(dataDC => {
          // console.log(dataDC);
          this.calendarioService.formDataDetalleCalendario = new detalleCalendario();
          this.calendarioService.formDataDetalleCalendario = dataDC[0];
          this.calendarioService.accionEvento = 'Editar';
          this.calendarioService.origen = this.procedencia;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "70%";
          this.dialog.open(AddEditCalendarComponent, dialogConfig);
        })
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // console.log(event);
        Swal.fire({
          title: '¿Segur@ de Borrar Evento?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
          confirmButtonText: 'Borrar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            //Elimina el evento del arreglo eventos
            this.calendarioService.deleteDetalleCalendario(+event.id).subscribe(res => {
              // console.log(res);
              Swal.fire({
                title: 'Borrado',
                icon: 'success',
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false

              });
              this.events = this.events.filter((iEvent) => iEvent !== event);
              // this.events2 = this.events2.filter((iEvent) => iEvent !== event);
              this.cargarCalendario(this.procedencia);
              // switch (this.procedencia) {
              //   case ('Compras'):
              //     console.log('CARGANDO CALENDARIO COMPRAS');
              //     this.cargarCalendario('Compras');
              //     break;
              //   case ('Almacen'):
              //     console.log('CARGANDO CALENDARIO ALMACEN');
              //     break;
              //   default:
              //     break;
              // }
            })
            // this.handleEvent('Deleted', event);

          }
        })

      },
    },
  ];


  actualizarEvento(event: any) {
    // console.log('Actualizar campo evento', event);
    // console.log(event.color.primary);
    // console.log(event.color.secondary);
    let evento = new detalleCalendario();
    evento.IdDetalleCalendario = event.id;
    evento.IdCalendario = this.idCalendario;
    evento.Folio = event.folio;
    evento.Documento = event.documento;
    evento.Descripcion = event.descripcion;
    evento.Title = event.title;
    evento.Draggable = 0;
    evento.ResizableBeforeStart = 0;
    evento.ResizableBeforeEnd = 0;
    evento.AllDay = 0
    evento.Start = event.start;
    evento.Endd = event.end;
    // evento.Start = new Date();
    // evento.Endd = new Date();
    evento.Color = event.color.primary.toString();
    // console.log(evento);
    // switch (this.procedencia) {
    //   case ('Compras'):
        //     console.log('EDITANDO EVENTO COMPRAS');
        this.calendarioService.editDetalleCalendario(evento).subscribe(res => {
          // this.refresh.next();
          this.cargarCalendario(this.procedencia);
          // console.log(res);
          //       this.onClose();
        })
    //     break;
    //   case ('Almacen'):
    //     break;
    //   default:
    //     break;
    // }
  }


  refresh: Subject<any> = new Subject();

  // //Arreglo de Eventos/Fechas
  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     end: startOfDay(new Date()),
  //     title: 'PROBANDO',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  activeDayIsOpen: boolean = true;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  //Al mover una fecha de dia/hora
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  //Este metodo recibe como parametro la accion a realizar (nomas se da display) y recibe el eveto de calendario que se abrira en un modal
  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
    // console.log(event);
    this.calendarioService.eventoInfo = event;
    this.calendarioService.getDetallesCalendarioIdDetalle(+event.id).subscribe(dataDC => {
      // console.log(dataDC);
      let folio = dataDC[0].Folio;
      switch (this.procedencia) {
        case ('Compras'):
          // console.log('CARGANDO CALENDARIO COMPRAS');
          this.comprasService.getComprasFolio(folio).subscribe(dataCompras => {
            // console.log(dataCompras);
            this.calendarioService.formDataCompras = dataCompras[0];
            this.calendarioService.origen = 'Compras';
            this.abrirModalEvent();
          })
          break;
        case ('Almacen'):
          // console.log('CARGANDO CALENDARIO ALMACEN');
          break;
        default:
          break;
      }


    })
  }

  abrirModalEvent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(EventCalendarComponent, dialogConfig);
  }
  //Agregar nueva FECHA
  addEvent(): void {
    // this.events = [
    //   ...this.events,
    //   {
    //     title: 'Nuevo Evento',
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     color: colors.red,
    //     actions: this.actions,
    //     draggable: false,
    //     resizable: {
    //       beforeStart: false,
    //       afterEnd: false,
    //     },
    //   },
    // ];

    this.calendarioService.formDataDetalleCalendario = new detalleCalendario();
    this.calendarioService.formDataDetalleCalendario.Color = '#271616';
    this.calendarioService.accionEvento = 'Agregar';
    this.calendarioService.origen = this.procedencia;
    this.calendarioService.IdCalendario = this.idCalendario;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(AddEditCalendarComponent, dialogConfig);



    //Agregar Calendario (MOVER A MODAL)
    // let detaCalen = new detalleCalendario(); 
    // console.log(this.idCalendario);
    // detaCalen.IdCalendario = this.idCalendario;
    // //generar automaticamente el Folio
    // detaCalen.Folio = 1
    // detaCalen.Documento = 'Documento';
    // detaCalen.Descripcion = 'Descripcion';
    // detaCalen.Start = new Date();
    // detaCalen.Endd = new Date();
    // detaCalen.Title = 'Title';
    // detaCalen.Color = 'red';
    // detaCalen.AllDay = 0;
    // detaCalen.ResizableBeforeStart = 0;
    // detaCalen.ResizableAfterEnd = 0;
    // detaCalen.Draggable = 0;

    // switch (this.procedencia) {
    //   case ('Compras'):
    //     console.log('AGREANDO EVENTO A COMPRAS');
    //     console.log(detaCalen);
    //     this.calendarioService.addDetalleCalendario(detaCalen).subscribe(res => {
    //       console.log(res);
    //       this.cargarCalendarioCompras('Compras');
    //     })
    //     break;
    //   case ('Almacen'):
    //     break;
    //   default:
    //     break;
    // }

  }
  //ELIMINAR EVENTO/FECHA DE LA TABLA
  deleteEvent(eventToDelete: CalendarEvent) {

    Swal.fire({
      title: '¿Segur@ de Borrar Evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        //Elimina el evento del arreglo eventos
        this.calendarioService.deleteDetalleCalendario(+eventToDelete.id).subscribe(res => {
          console.log(res);
          this.events = this.events.filter((event) => event !== eventToDelete);
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1500,
            showCancelButton: false,
            showConfirmButton: false

          });
          // switch (this.procedencia) {
          //   case ('Compras'):
          //     console.log('CARGANDO CALENDARIO COMPRAS');
          //     this.cargarCalendarioCompras('Compras');
          //     break;
          //   case ('Almacen'):
          //     console.log('CARGANDO CALENDARIO ALMACEN');
          //     break;
          //   default:
          //     break;
          // }
          this.cargarCalendario(this.procedencia);
        })
        // this.handleEvent('Deleted', event);

      }
    })

    //elimina el evento del arreglo eventos
    // console.log(eventToDelete);
    // this.calendarioService.deleteDetalleCalendario(+eventToDelete.id).subscribe(res=>{
    //   console.log(res);
    //   this.events = this.events.filter((event) => event !== eventToDelete);

    // switch (this.procedencia) {
    //   case ('Compras'):
    //     console.log('CARGANDO CALENDARIO COMPRAS');
    //       this.cargarCalendarioCompras('Compras');
    //     break;
    //   case ('Almacen'):
    //     console.log('CARGANDO CALENDARIO ALMACEN');
    //     break;
    //   default:
    //     break;
    // }

    // })
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
