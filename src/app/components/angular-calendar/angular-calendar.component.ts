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
} from 'angular-calendar';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddEditCalendarComponent } from './add-edit-calendar/add-edit-calendar.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { CompraService } from '../../services/compras/compra.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./angular-calendar.component.css']
})
export class AngularCalendarComponent implements OnInit {

  constructor(private modal: NgbModal, private calendarioService: CalendarioService, private dialog: MatDialog, public comprasService: CompraService) {
    
    this.calendarioService.listen().subscribe((procedencia:any)=>{
      // console.log(procedencia);   
        this.verificarProcedencia(procedencia);
      });

  }
  
  ngOnInit() {
  }

  

  //arreglo de eventos
  events: CalendarEvent[] = []
  events2: CalendarEvent[] = []

  //procedencia(de donde se cargo el modulo)
  procedencia: string;
  //idCalendario
  idCalendario: number;


  verificarProcedencia( moduloProcedencia: string ){
console.warn(moduloProcedencia);

switch(moduloProcedencia){
case ('Compras'):
  console.log('VIENE DE COMPRAS');
  this.procedencia = 'Compras'
  this.cargarCalendarioCompras(moduloProcedencia);
  break;
  case ('Almacen'):
    this.procedencia = 'Almacen'
    console.log('VIENE DE ALMACEN');
    break;
    default:
      this.procedencia = 'ninguno'
      console.log('Ninguno corresponde');
      break;

}

  }

   

  //Obtener informacion Calendario Compras
  cargarCalendarioCompras(modulo: string){
    this.calendarioService.getCalendarioCompras(modulo).subscribe(dataCalendario=>{
      this.idCalendario = +dataCalendario[0].IdCalendario;
      console.log('----------------ID CALENDARIO-----------');
      console.log(this.idCalendario);
      console.log(dataCalendario);
      this.events = []; 
      this.calendarioService.getDetallesCalendarioId(dataCalendario[0].IdCalendario).subscribe(dataDC=>{
      this.events2 = [];

        for (let i = 0; i < dataDC.length; i++) {
      //     //objeto eveto
        let event: any;
          event = [];
      //   event.id = dataDC[i].IdDetalleCalendario;
      //   event.start = startOfDay(new Date());
      //   // event.start = startOfDay(dataDC[i].Start);
      //   // this.event.start = dataDC[i].Start;
      //   // this.event.end = dataDC[i].Endd;
      //   // event.end = endOfDay(dataDC[i].Endd);
      //   event.end = endOfDay(new Date());
      //  event.title = dataDC[i].Title;
      //   //Obtener el color
      //   let color = dataDC[i].Color
      //   //Poner correctamente el color 
      //   event.color = colors.yellow;
      //   event.actions = this.actions;
      //   console.log(dataDC);
      //   //hacer push al arreglo de objetos 'Eventos'
      //   this.events2[i] = event;
///////////////
        event.id = dataDC[i].IdDetalleCalendario;
        event.start= startOfDay(new Date());
        event.end= endOfDay(new Date());
        event.title=dataDC[i].Title;
        event.color = colors.yellow;
        event.actions= this.actions;

        this.events.push(event);
         this.refresh.next();


///////////////

        }  
        console.log(this.events);    
      })
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
        console.log(event);
        this.calendarioService.getDetallesCalendarioIdDetalle(+event.id).subscribe(dataDC=>{
          console.log(dataDC);
          this.calendarioService.formDataDetalleCalendario = new detalleCalendario();
          this.calendarioService.formDataDetalleCalendario = dataDC[0];
          this.calendarioService.accionEvento = 'Editar';
          this.calendarioService.origen = this.procedencia;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width="70%";
          this.dialog.open(AddEditCalendarComponent, dialogConfig);
        })
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log(event);
        //Elimina el evento del arreglo eventos
        this.calendarioService.deleteDetalleCalendario(+event.id).subscribe(res=>{
          console.log(res);
          this.events = this.events.filter((iEvent) => iEvent !== event);
          switch (this.procedencia) {
            case ('Compras'):
              console.log('CARGANDO CALENDARIO COMPRAS');
                this.cargarCalendarioCompras('Compras');
              break;
            case ('Almacen'):
              console.log('CARGANDO CALENDARIO ALMACEN');
              break;
            default:
              break;
          }
        })
        // this.handleEvent('Deleted', event);
      },
    },
  ];

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
    console.log(event);
    this.calendarioService.getDetallesCalendarioIdDetalle(+event.id).subscribe(dataDC=>{
      console.log(dataDC);
      let folio = dataDC[0].Folio;
      switch (this.procedencia) {
        case ('Compras'):
          console.log('CARGANDO CALENDARIO COMPRAS');
            this.comprasService.getComprasFolio(folio).subscribe(dataCompras=>{
console.log(dataCompras);
this.calendarioService.formDataCompras = dataCompras[0];
this.calendarioService.origen = 'Compras';
this.abrirModalEvent();
            })
          break;
        case ('Almacen'):
          console.log('CARGANDO CALENDARIO ALMACEN');
          break;
        default:
          break;
      }


    })
  }

  abrirModalEvent(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
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
    this.calendarioService.accionEvento = 'Agregar';
    this.calendarioService.origen = this.procedencia;
    this.calendarioService.IdCalendario = this.idCalendario;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
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
    //elimina el evento del arreglo eventos
    console.log(eventToDelete);
    this.calendarioService.deleteDetalleCalendario(+eventToDelete.id).subscribe(res=>{
      console.log(res);
      this.events = this.events.filter((event) => event !== eventToDelete);
      
    switch (this.procedencia) {
      case ('Compras'):
        console.log('CARGANDO CALENDARIO COMPRAS');
          this.cargarCalendarioCompras('Compras');
        break;
      case ('Almacen'):
        console.log('CARGANDO CALENDARIO ALMACEN');
        break;
      default:
        break;
    }
      
    })
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
