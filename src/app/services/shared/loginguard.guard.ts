import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StorageServiceService } from './storage-service.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginguardGuard implements CanActivate {

  constructor(private router: Router,
    private storageService: StorageServiceService, public location: Location) {}

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    if (this.storageService.isAuthenticated()) {
      // logged in so return true
      return true;
    }

   /*  console.log(this.location.path())

    if (this.location.path()=='/documento'){
      this.router.navigate(['/register']);
      return false;
    } */
    /* if (next.url.indexOf('documento') !== -1) { return true; } */
  
    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    /* this.router.navigate(['/documento/:token']); */
    return false;
  }
  }
