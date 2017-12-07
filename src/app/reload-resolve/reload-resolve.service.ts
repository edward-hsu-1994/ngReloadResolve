import { Injectable, Injector, SkipSelf } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class ReloadResolveService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @SkipSelf() private inj: Injector
  ) {}

  public reloadResolve(): Promise<boolean> {
    // 調整導引狀態為尚未導引
    this.router.navigated = false;
    console.log(this.inj.get(ActivatedRoute));
    const temp = [];
    for (let index = 0; index < this.router.config.length; index++) {
      temp.push(this.router.config[index].runGuardsAndResolvers);
      this.router.config[index].runGuardsAndResolvers = 'always';
    }

    // 重新導引到目前路由
    return this.router.navigate([], this.route.snapshot).then(x => {
      for (let index = 0; index < this.router.config.length; index++) {
        this.router.config[index].runGuardsAndResolvers = temp[index];
      }
      return x;
    });
  }
}
