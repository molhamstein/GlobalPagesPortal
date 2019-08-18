import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, PreloadingStrategy, PreloadAllModules } from '@angular/router';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { PagesModule } from './main/content/pages/pages.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';

import { MarkdownModule } from 'angular2-markdown';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from './core/services/auth.gard';

const appRoutes: Routes = [
   
    {
        path: '',
        redirectTo: '/pages/users-management',
        pathMatch: 'full',
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        PagesModule,
        RouterModule.forRoot(appRoutes, { enableTracing: false, useHash: true  }),
        SharedModule,
        MarkdownModule.forRoot(),
        TranslateModule.forRoot(),
        FuseMainModule,
    ],
    providers: [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
        AuthGuard
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
