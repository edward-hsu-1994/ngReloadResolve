import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyTestComponent } from './my-test/my-test.component';
import { ReloadResolveModule } from './reload-resolve/reload-resolve.module';
import { ReloadResolveService } from './reload-resolve/reload-resolve.service';

@NgModule({
  declarations: [AppComponent, MyTestComponent],
  imports: [BrowserModule, AppRoutingModule, ReloadResolveModule],
  providers: [ReloadResolveService],
  bootstrap: [AppComponent]
})
export class AppModule {}
