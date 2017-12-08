import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ReloadResolveService } from '../../reload-resolve/reload-resolve.service';

@Component({
  selector: 'app-my-test',
  templateUrl: './my-test.component.html',
  styleUrls: ['./my-test.component.css']
})
export class MyTestComponent implements OnInit {
  time;

  constructor(
    public reloader: ReloadResolveService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    route.data.subscribe(x => {
      this.time = x['time'];
      console.log(this.time);
    });
    console.log(route.routeConfig);
  }

  ngOnInit() {}

  updateTime() {
    this.router.navigate([], {
      // navigate to self
      queryParams: {
        // change query (use to test Resolve)
        time: new Date().getTime()
      }
    });
  }

  reload() {
    this.reloader.reloadResolve();
  }

  updateTimeAndReload() {
    this.router
      .navigate([], {
        // navigate to self
        queryParams: {
          // change query (use to test Resolve)
          time: new Date().getTime()
        }
      })
      .then(x => {
        this.reloader.reloadResolve();
      });
  }
}
