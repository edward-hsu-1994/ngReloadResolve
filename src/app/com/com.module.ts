import { MyTestComponent } from './my-test/my-test.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [MyTestComponent],
  declarations: [MyTestComponent]
})
export class ComModule {}
