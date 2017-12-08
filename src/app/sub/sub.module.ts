import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubRoutingModule } from './sub-routing.module';
import { AppModule } from '../app.module';
import { ComModule } from '../com/com.module';

@NgModule({
  imports: [CommonModule, SubRoutingModule, ComModule],
  declarations: []
})
export class SubModule {}
