import { NgModule, Injectable } from '@angular/core';
import {
  Routes,
  RouterModule,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MyTestComponent } from './my-test/my-test.component';

@Injectable()
export class TimeResolve implements Resolve<number[]> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): number[] | Observable<number[]> | Promise<number[]> {
    console.log(route.queryParams['pp']);
    return route.queryParams['pp']; // 每次執行都會傳不同的時間
  }
}

const routes: Routes = [
  {
    path: 'abc',
    component: MyTestComponent,
    resolve: {
      time: TimeResolve
    }
  },
  {
    path: 'def',
    component: MyTestComponent,
    resolve: {
      time: TimeResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [TimeResolve],
  exports: [RouterModule]
})
export class AppRoutingModule {}
