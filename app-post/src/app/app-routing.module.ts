import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { ListPostComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: "", component: ListPostComponent},
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: "create/:postId", component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: "auth", loadChildren: () => { return import('./auth/auth.module').then(m => m.AuthModule);}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
