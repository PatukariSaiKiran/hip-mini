import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayout } from './shared/layout/public-layout/public-layout';
import { Landing } from './features/public/pages/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { PrivateLayout } from './shared/layout/private-layout/private-layout';
import { ManageApi } from './features/apis/pages/manage-api/manage-api';
import { CreateApi } from './features/apis/pages/create-api/create-api';
import { SubscriptionsList } from './features/subscriptions/pages/subscriptions-list/subscriptions-list';
import { SubscriptionDetails } from './features/subscriptions/pages/subscription-details/subscription-details';
import { ApiApprovals } from './features/approvals/pages/api-approvals/api-approvals';
import { SubscriptionsApprovals } from './features/approvals/pages/subscriptions-approvals/subscriptions-approvals';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';



const routes: Routes = [
  // Public area (header + footer)
  {path:'',
    component: PublicLayout,
    children: [
      { path:'',component: Landing },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ]
  },
  //Private Area (Header + Sidebar + Footer)
  {
    path:'app',
    component: PrivateLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'manage-apis', pathMatch: 'full' },
      { path: 'manage-apis', component: ManageApi },
      { path: 'create-api', component: CreateApi },
      { path: 'subscriptions', component: SubscriptionsList },
      { path: 'subscription/:id', component: SubscriptionDetails },

      //for now keep approvals routes  only admin
      { path: 'approvals', component: ApiApprovals, canActivate: [RoleGuard]},
      { path: 'approvals/subscriptions', component: SubscriptionsApprovals },

    ],
  },

  // fallback (anything wrong goes to home)
  {
    path: '**', redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
