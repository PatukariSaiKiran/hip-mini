import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from './confirm-dialog';



@NgModule({
  declarations: [ConfirmDialog],
  imports: [
    CommonModule
  ],
  exports: [ConfirmDialog]
})
export class ConfirmDialogModule { }
