// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { APIUrl } from 'src/app/services/pedidos/pedido.service';

export const environment = {
  production: false,
  // APIUrl: 'http://74.208.251.38:44361/api',
// export const APIUrl = "https://localhost:44361/api";
  // APIUrlEmail: 'http://74.208.251.38:3000'
  // APIUrl: 'http://riztekserver.ddns.net:44361/api',
  // APIUrlEmail: 'http://riztekserver.ddns.net:3000'
  // APIUrl: 'https://erpprolapp.ddns.net:44361/api',
  // APIUrlEmail: 'https://erpprolapp.ddns.net:3000'
  // APIUrlEmail: 'http://riztekserver.ddns.net:3000'
  //URLS de desarrollo
  APIUrl: 'https://riztekserver.ddns.net:44361/api',
  APIUrlEmail: 'https://riztekserver.ddns.net:3000', 
  // URLS de Produccion
   //    APIUrl: 'https://erpprolapp.ddns.net:44361/api',
      // APIUrlEmail: 'https://erpprolapp.ddns.net:3000'
    // APIUrl: 'https://erpprolapp.ddns.net:44361/api',
    //APIUrlEmail: 'https://erpprolapp.ddns.net:3000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
