# NgReloadResolve

[![npm version](https://badge.fury.io/js/ng-reload-resolve.svg)](https://badge.fury.io/js/ng-reload-resolve)
[![Downloads](https://img.shields.io/npm/dm/ng-reload-resolve.svg)](https://www.npmjs.com/package/ng-reload-resolve)
[![license](https://img.shields.io/github/license/xupeiyao/ngReloadResolve.svg)](https://github.com/XuPeiYao/ngReloadResolve/blob/master/LICENSE)

Reload angular routing resolve.

# Install

```bash
npm install ng-reload-resolve
```

# Getting Started

## 1. Import

```typescript
import { ReloadResolveModule } from 'ng-reload-resolve';

@NgModule({
  ...something...
  imports: [ReloadResolveModule]
})
export class YourModule {}
```

## 2. DI

```typescript
export class MyTestComponent implements OnInit {
  constructor(
    public reloader: ReloadResolveService
  ) {}

  ngOnInit() {}

  doReload() {
    this.reloader.reloadResolve().then(console.log);
  }
```

# Example

## 1. Create a simple resolve

```typescript
// Sample Resolve
@Injectable()
export class TimeResolve implements Resolve<number[]> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): number[] | Observable<number[]> | Promise<number[]> {
    return route.queryParams['time']; // always get time from query params
  }
}
```

## 2. Create routing component

```typescript
// Your Routing Component
@Component({
  selector: 'app-my-test',
  templateUrl: `
  <p>
    resolve from query: time={{time}}
  </p>
  <button (click)="updateTime()">UpdateTime</button>
  <button (click)="reload()">Reload</button>
  <button (click)="updateTimeAndReload()">updateTimeAndReload</button>
  `,
  styleUrls: ['./my-test.component.css']
})
export class MyTestComponent implements OnInit {
  time; // show on page

  constructor(
    public reloader: ReloadResolveService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    route.data.subscribe(x => {
      // when resolve loaded
      this.time = x['time']; // set value to this.time
    });
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
    // reload Resolve
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
```

## Demo

![Imgur](https://i.imgur.com/7xCqfb4.gif)
