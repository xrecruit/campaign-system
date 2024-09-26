import { Component, OnInit } from '@angular/core';
import { ManageSmtpService } from "./manage-smtp.service"
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material';
import { SetPasswordComponent } from '../../modals/set-password/set-password.component';
import { DomainsDetails } from '../../.././app.config'

@Component({
  selector: 'app-manage-smtp',
  templateUrl: './manage-smtp.component.html',
  styleUrls: ['./manage-smtp.component.scss']
})
export class ManageSmtpComponent implements OnInit {
  smtpList: any;
  apiInProgress: boolean;
  popUpValue: Array<any>;
  domainDetails = DomainsDetails;

  constructor(
    private manageSmtpService: ManageSmtpService,
    private commonService: CommonService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getSmtpList();
  }

  async getSmtpList() {
    try {
      const data = await this.manageSmtpService.getSmtpList() as Array<any>;
      this.smtpList = data.sort((a, b) => a.priority > b.priority ? 1 : -1);
      this.smtpList.forEach(smtp => {
        this.domainDetails.forEach(domain => {
          if (smtp.mail_server === domain.smtp) {
            smtp['imgSrc'] = domain.src;
          }
        });
      });
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async removeUser(id: string) {
    try {
      const res = await this.commonService.openConfirmationBox("Are you sure ?");
      if (res == 'yes') {
        await this.manageSmtpService.deleteSmtp(id);
        this.getSmtpList();
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async changePriority(smtp, position, index) {
    try {
      await this.manageSmtpService.changePriorityOfSmtp({
        id: smtp._id,
        position: position
      });
      if (position === 1) {
        [this.smtpList[index], this.smtpList[index - 1]] = [this.smtpList[index - 1], this.smtpList[index]];
      }
      else {
        [this.smtpList[index], this.smtpList[index + 1]] = [this.smtpList[index + 1], this.smtpList[index]];
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  updatePassword(smtpId) {
    this.dialog.open(SetPasswordComponent, {
      data: { id: smtpId }
    }).afterClosed().subscribe(result => {
      this.popUpValue = null;
      if (result.message) {
        this.popUpValue = [result.message, false];
      }
      if (result.error) {
        this.popUpValue = [result.error.message, true];
      }
    })
  }

}
