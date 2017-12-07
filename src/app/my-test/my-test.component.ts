import { Component, OnInit } from '@angular/core';
import { ReloadResolveService } from '../reload-resolve/reload-resolve.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-test',
  templateUrl: './my-test.component.html',
  styleUrls: ['./my-test.component.css']
})
export class MyTestComponent implements OnInit {
  constructor(
    public reloader: ReloadResolveService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    console.log(route.routeConfig);
  }

  ngOnInit() {}

  reload() {
    this.router
      .navigate([], {
        queryParams: {
          pp: new Date().getTime()
        }
      })
      .then(x => {
        this.reloader.reloadResolve().then(() => {});
      });
  }
}
