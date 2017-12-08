import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeResolve } from '../app-routing.module';
import { MyTestComponent } from '../com/my-test/my-test.component';

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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubRoutingModule {}
