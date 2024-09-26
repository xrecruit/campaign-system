import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptors/interceptor.service';
import { MaterialModule } from './material/angular-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthGuardService } from './services/auth-Guard/auth-guard.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CampaignDescriptionComponent } from './modules/modals/campaign-description/campaign-description.component';
import { UpdateCampaignComponent } from './modules/modals/update-campaign/update-campaign.component';
import { ConfirmationDialogComponent } from './modules/modals/confirmation-dialog/confirmation-dialog.component';
import { UploadCsvComponent } from './modules/modals/upload-csv/upload-csv.component';
import { HitDetailsComponent } from './modules/modals/hit-details/hit-details.component';
import { PopUpMessageModule } from './modules/components/popup-message/pop-up-message.module';
import { AddUserComponent } from './modules/modals/add-user/add-user.component';
import { TestMailComponent } from './modules/modals/test-mail/test-mail.component';
import { SendMailConfigurationComponent } from './modules/modals/send-mail-configuration/send-mail-configuration.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SetPasswordComponent } from './modules/modals/set-password/set-password.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignDescriptionComponent,
    UpdateCampaignComponent,
    ConfirmationDialogComponent,
    UploadCsvComponent,
    HitDetailsComponent,
    AddUserComponent,
    TestMailComponent,
    SendMailConfigurationComponent,
    SetPasswordComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    PopUpMessageModule
  ],
  providers: [
    [AppConfig],
    [DatePipe],
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    Title,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  entryComponents: [
    CampaignDescriptionComponent,
    UpdateCampaignComponent,
    ConfirmationDialogComponent,
    UploadCsvComponent,
    HitDetailsComponent,
    AddUserComponent,
    TestMailComponent,
    SendMailConfigurationComponent,
    SetPasswordComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
