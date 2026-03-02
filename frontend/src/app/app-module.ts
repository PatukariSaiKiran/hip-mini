import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { App } from './app';
import { Header } from './shared/layout/header/header';
import { Sidebar } from './shared/layout/sidebar/sidebar';
import { Footer } from './shared/layout/footer/footer';
import { PublicLayout } from './shared/layout/public-layout/public-layout';
import { PrivateLayout } from './shared/layout/private-layout/private-layout';
import { Landing } from './features/public/pages/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { CreateApi } from './features/apis/pages/create-api/create-api';
import { ManageApi } from './features/apis/pages/manage-api/manage-api';
import { ApiDetails } from './features/apis/pages/api-details/api-details';
import { EditApi } from './features/apis/pages/edit-api/edit-api';
import { SubscriptionsList } from './features/subscriptions/pages/subscriptions-list/subscriptions-list';
import { ApiApprovals } from './features/approvals/pages/api-approvals/api-approvals';
import { SubscriptionsApprovals } from './features/approvals/pages/subscriptions-approvals/subscriptions-approvals';
import { SearchBar } from './shared/ui/search-bar/search-bar';
import { StatusFilter } from './shared/ui/status-filter/status-filter';
import { Pagination } from './shared/ui/pagination/pagination';
import { ConfirmDialog } from './shared/ui/confirm-dialog/confirm-dialog';
import { Loader } from './shared/ui/loader/loader';
import { EmptyState } from './shared/ui/empty-state/empty-state';
import { SubscriptionDetails } from './features/subscriptions/pages/subscription-details/subscription-details';
import { ConfirmDialogModule } from './shared/ui/confirm-dialog/confirm-dialog.module';
import { DataTable } from './shared/ui/data-table/data-table';

@NgModule({
  declarations: [
    App,
    Header,
    Sidebar,
    Footer,
    PublicLayout,
    PrivateLayout,
    Landing,
    Login,
    Register,
    CreateApi,
    ManageApi,
    ApiDetails,
    EditApi,
    SubscriptionsList,
    ApiApprovals,
    SubscriptionsApprovals,
    SearchBar,
    StatusFilter,
    Pagination,
    Loader,
    EmptyState,
    SubscriptionDetails,
    DataTable
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ConfirmDialogModule
  ],
  providers: [
   

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
