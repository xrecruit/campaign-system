import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignDescriptionComponent } from 'src/app/modules/modals/campaign-description/campaign-description.component';
import { CampaignListService } from '../campaign-list.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCampaignComponent } from 'src/app/modules/modals/update-campaign/update-campaign.component';
import { Subscription } from 'rxjs';
import { UploadCsvComponent } from 'src/app/modules/modals/upload-csv/upload-csv.component';
import { HitDetailsComponent } from 'src/app/modules/modals/hit-details/hit-details.component';
import { AddUserComponent } from 'src/app/modules/modals/add-user/add-user.component';
import { TestMailComponent } from 'src/app/modules/modals/test-mail/test-mail.component';
import { SendMailConfigurationComponent } from 'src/app/modules/modals/send-mail-configuration/send-mail-configuration.component';
import { ComposeEmailService } from '../../compose-email/compose-email.service';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit, OnDestroy {

  campaignDetails: any
  userDetails: any;
  popUpValue: any;
  dialogSubs: Subscription;
  apiInProcess: boolean;

  sendMailInProcess: any;
  sendMailError: any;
  errorMsg: any;

  constructor(public dialog: MatDialog,
    private campaignListService: CampaignListService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private composeEmailService: ComposeEmailService
  ) {
    this.dialogSubs = this.campaignListService.getEventValue().subscribe(item => {
      switch (item) {
        case 'edit':
          this.editCampaignDialog();
          break;
        case 'update':
          this.updateCampaign();
          break;
        case 'sendMail':
          this.openSendMailConfiguration();
          break;
        case 'addUser':
          this.addUser();
          break;
        case 'sendTestMail':
          this.openSendTestMail();
          break;
        case 'openCsv':
          this.assignUsersWithCsv();
          break;
        case 'validate':
          this.validateUsers();
          break;
        default:
          this.openClickDetails();
      }
    })
  }

  ngOnInit() {
    this.getUserDetails(true);
  }

  async getUserDetails(isFirstCall) {
    this.apiInProcess = isFirstCall;
    try {
      const res = await this.campaignListService.campaignDetails(this.route.snapshot.paramMap.get('id'));
      this.campaignDetails = res;
      this.userDetails = res.users;
      if (this.userDetails.length === 0) {
        this.userDetails = null;
        this.popUpValue = ['Do not have any assign users.', true];
      }
      else {
        let errorMessage: String;
        this.userDetails.forEach((item) => {
          if (item.successful) {
            const [seenDetail] = item.hit_details;
            if (seenDetail.seen) {
              item.hit_details = seenDetail;
              item['seen'] = true;
            }
            else {
              item['seen'] = false;
              item.hit_details = seenDetail;
            }
          } else {
            item.send_status = 'Not Sended Yet';
            if (item.error_message && !errorMessage) {
              errorMessage = item.error_message;
            }
          }
        })
        if (errorMessage) {
          this.popUpValue = [errorMessage, true];
        }
      }
      this.apiInProcess = false;
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false;
    }
  }

  editCampaignDialog() {
    const dialogRef = this.dialog.open(CampaignDescriptionComponent, {
      width: '700px',
      minHeight: '300px',
      data: {
        campaignDetail: this.campaignDetails
      }
    })
    dialogRef.afterClosed().subscribe(campaignDetails => {
      if (campaignDetails) {
        this.editCampaign(campaignDetails);
      }
    })
  }

  async editCampaign(campaignDetail) {
    const defaultEmail = this.campaignDetails.message_detail[0];
    try {
      const res = await this.campaignListService.editCampaignDetails({
        id: this.campaignDetails._id,
        campaignDetails: {
          "campaign_name": campaignDetail.campaignName,
          "campaign_description": campaignDetail.campaignDescription,
          "status": this.campaignDetails.status,
          "message": campaignDetail.message || defaultEmail.message,
          "message_subject": campaignDetail.subject || defaultEmail.message_subject,
          "message_id": (campaignDetail.message && campaignDetail.emails.message_id) || defaultEmail.message_id
        },
      });
      this.popUpValue = [res.message, false];
      this.campaignDetails.Campaign_name = campaignDetail.campaignName;
      this.campaignDetails.Campaign_description = campaignDetail.campaignDescription;
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  updateCampaign() {
    const dialog = this.dialog.open(UpdateCampaignComponent, {
      width: '700px',
      minHeight: '300px',
      data: {
        campaign: this.campaignDetails
      }
    });
    dialog.afterClosed().subscribe(campaignDetails => {
      if (campaignDetails) {
        this.updateCampaignDetails(campaignDetails);
      }
    })
  }

  async updateCampaignDetails(campaignDetail) {
    try {
      const res = await this.campaignListService.editCampaignDetails({
        id: this.campaignDetails._id,
        campaignDetails: {
          "campaign_name": this.campaignDetails.Campaign_name,
          "campaign_description": this.campaignDetails.Campaign_description,
          "status": this.campaignDetails.status,
          "message_detail": [{ message_subject: campaignDetail[0].message_subject, message: campaignDetail[0].message }]
        }
      });
      if (campaignDetail[0].attachment) {
        await this.composeEmailService.addAttachment({
          campaign_id: this.campaignDetails._id,
          message_id: res.message_id,
          file: campaignDetail[0].formData
        })
      }
      this.popUpValue = [res.message, false];
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  assignUsersWithCsv() {
    const dialog = this.dialog.open(UploadCsvComponent, {
      width: '500px',
    });
    dialog.afterClosed().subscribe(userData => {
      if (userData) {
        this.assignUsers({
          "users": userData,
          "campaign": this.campaignDetails._id
        })
      }
    })
  }

  async assignUsers(body) {
    this.sendMailInProcess = true;
    try {
      const res = await this.campaignListService.assignUser(body);
      this.getUserDetails(false);
      this.sendMailInProcess = false;
    } catch (error) {
      this.sendMailInProcess = false;
      this.commonService.handleError(error);
    }
  }

  openSendMailConfiguration() {
    const dialog = this.dialog.open(SendMailConfigurationComponent, {
      width: '400px',
      minHeight: '300px',
      panelClass: 'custom-dialog-container',
      data: { sendMailError: this.sendMailError }
    });
    this.errorMsg = false;
    dialog.afterClosed().subscribe((formValue) => {
      if (formValue)
        this.sendMailToUsers(formValue);
    })
  }

  async sendMailToUsers(smtps) {
    smtps.selectedSmtp = smtps.selectedSmtp.filter(item => item !== false);
    if (smtps.selectedSmtp.length > 0) {
      const smtpIds = [];
      smtps.selectedSmtp.forEach(item => smtpIds.push(item._id))
      const sendMailConfig = { ids: [], delay: smtps.interval, smtps: smtpIds };
      this.sendMailInProcess = true;
      try {
        this.userDetails.forEach((item) => {
          if (!item.successful)
            sendMailConfig.ids.push(item._id);
        })
        if (sendMailConfig.ids.length === 0) {
          this.sendMailInProcess = false;
          this.popUpValue = ['Please add users to send mail', true];
        }
        else {
          const res = await this.campaignListService.sendMail(sendMailConfig, this.campaignDetails._id);
          this.getUserDetails(false);
          this.sendMailInProcess = false;
          this.popUpValue = [res['message'], false];
        }
      } catch (error) {
        this.sendMailInProcess = false;
        this.sendMailError = error.error;
        this.errorMsg = `${error.error.message} of ${error.error.mail}`;
      }
    }
    else {
      this.popUpValue = ['Please select minimum one smtp to send mail', true];
    }
  }

  openSendTestMail() {
    const dialog = this.dialog.open(TestMailComponent, {
      width: '400px'
    })
    dialog.afterClosed().subscribe((email) => {
      if (email)
        this.sendTestMail(email);
    })
  }

  async sendTestMail(testMail) {
    const randomNum = Math.floor(Math.random() * this.campaignDetails.message_detail.length);
    try {
      const res = await this.campaignListService.sendTestMail({
        email: testMail.email,
        message: this.campaignDetails.message_detail[randomNum].message,
        message_subject: this.campaignDetails.message_detail[randomNum].message_subject
      });
      this.popUpValue = [res['message'], false];
    } catch (error) {
      this.popUpValue = [`${error.error.message} of ${error.error.mail}`, true]
    }
  }

  addUser() {
    const dialog = this.dialog.open(AddUserComponent, {
      width: '400px',
    })
    dialog.afterClosed().subscribe((userDetails) => {
      if (userDetails) {
        this.assignUsers({
          "users": [userDetails],
          "campaign": this.campaignDetails._id
        })
      }
    })
  }

  openHitDetails(userDetails) {
    this.dialog.open(HitDetailsComponent, {
      width: '680px',
      data: {
        campaignDetail: userDetails
      }
    });
  }

  openClickDetails() {
    this.router.navigate(['settings/campaign-list/click-details', this.campaignDetails._id, this.campaignDetails.Campaign_name]);
  }

  async  removeUser(userId) {
    try {
      const res = await this.campaignListService.deleteUser({
        campaignId: this.campaignDetails._id,
        userId: userId
      });
      this.userDetails = this.userDetails.filter(item => item._id != userId);
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async validateUsers() {
    try {
      this.apiInProcess = true;
      await this.campaignListService.validateUser(this.campaignDetails);
      this.apiInProcess = false;
      this.getUserDetails(true);
    } catch (error) {
      this.apiInProcess = false;
      this.commonService.handleError(error);
    }
  }

  downloadUserList() {
    let validUser = this.userDetails.filter(item => item.status);
    this.campaignListService.downloadFile(validUser, 'validUserList')
  }

  ngOnDestroy() {
    this.dialogSubs.unsubscribe();
  }

}
