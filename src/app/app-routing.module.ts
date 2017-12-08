import { NgModule, Injectable } from '@angular/core';
import {
  Routes,
  RouterModule,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MyTestComponent } from './com/my-test/my-test.component';

@Injectable()
export class TimeResolve implements Resolve<number[]> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): number[] | Observable<number[]> | Promise<number[]> {
    return route.queryParams['time']; // 每次執行都會傳不同的時間
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
    loadChildren: './sub/sub.module#SubModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [TimeResolve],
  exports: [RouterModule]
})
export class AppRoutingModule {}
