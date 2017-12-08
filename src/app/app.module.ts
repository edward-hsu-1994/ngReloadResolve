import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReloadResolveModule } from './reload-resolve/reload-resolve.module';
import { ReloadResolveService } from './reload-resolve/reload-resolve.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ComModule } from './com/com.module';

@NgModule({
  declarations: [AppComponent],
  exports: [],
  imports: [ComModule, BrowserModule, AppRoutingModule, ReloadResolveModule],
  providers: [ReloadResolveService],
  bootstrap: [AppComponent]
})
export class AppModule {}
