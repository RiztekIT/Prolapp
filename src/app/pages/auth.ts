import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageServiceService } from '../services/shared/storage-service.service';

@Injectable()
export class AuthorizatedGuard implements CanActivate {
  constructor(private router: Router,
              private storageService: StorageServiceService) { }
  canActivate() {
    console.log(this.storageService.isAuthenticated());
    if (this.storageService.isAuthenticated()) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page
    /* this.router.navigate(['/login']); */
    this.router.navigate(['/documento/:token']);
    return false;
  }
}