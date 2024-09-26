import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnsubscribeUsersRoutingModule } from './unsubscribe-users-routing.module';
import { UnsubscribeUsersComponent } from './unsubscribe-users.component';
import { PopUpMessageModule } from '../../components/popup-message/pop-up-message.module';


@NgModule({
  declarations: [UnsubscribeUsersComponent],
  imports: [
    CommonModule,
    UnsubscribeUsersRoutingModule,
    PopUpMessageModule
  ]
})
export class UnsubscribeUsersModule { }
