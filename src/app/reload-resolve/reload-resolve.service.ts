import { Injectable, Injector, SkipSelf } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Route,
  ActivatedRouteSnapshot,
  NavigationEnd
} from '@angular/router';

import 'rxjs/operator/toPromise';

@Injectable()
export class ReloadResolveService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inj: Injector
  ) {}

  private getCurrentRouteConfig(rootActivateRoute: ActivatedRoute): Route {
    if (rootActivateRoute.firstChild) {
      return this.getCurrentRouteConfig(rootActivateRoute.firstChild);
    } else {
      return rootActivateRoute.routeConfig;
    }
  }

  public reloadResolve(reuse: boolean = true): Promise<boolean> {
    const config = this.getCurrentRouteConfig(this.router.routerState.root);
    const temp = config.runGuardsAndResolvers;
    config.runGuardsAndResolvers = 'always';
    this.router.navigated = false;

    if (!reuse) {
      const reuseMethod = this.router.routeReuseStrategy.shouldReuseRoute;
      this.router.routeReuseStrategy.shouldReuseRoute = (future, curr) => {
        return false;
      };

      this.router.events.subscribe(evt => {
        if (evt instanceof NavigationEnd) {
          // trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
          // if you need to scroll back to top, here is the right place
          window.scrollTo(0, 0);

          config.runGuardsAndResolvers = temp;

          this.router.routeReuseStrategy.shouldReuseRoute = reuseMethod;
        }
      });

      // 重新導引到目前路由
      return this.router.navigateByUrl(this.router.url);
    }

    // 重新導引到目前路由
    return this.router.navigateByUrl(this.router.url).then(x => {
      config.runGuardsAndResolvers = temp;
      return x;
    });
  }
}
