import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StorageServiceService } from './storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginguardGuard implements CanActivate {

  constructor(private router: Router,
    private storageService: StorageServiceService) {}
  canActivate(){
    if (this.storageService.isAuthenticated()) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
  }
