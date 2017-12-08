import { Injectable, Injector, SkipSelf } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Route,
  ActivatedRouteSnapshot
} from '@angular/router';

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

  public reloadResolve(): Promise<boolean> {
    const config = this.getCurrentRouteConfig(this.router.routerState.root);

    const temp = config.runGuardsAndResolvers;
    config.runGuardsAndResolvers = 'always';
    this.router.navigated = false;

    // 重新導引到目前路由
    return this.router.navigate([], this.route.snapshot).then(x => {
      config.runGuardsAndResolvers = temp;
      return x;
    });
  }
}
