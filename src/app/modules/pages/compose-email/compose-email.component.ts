import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonService } from 'src/app/services/common.service';
import { ComposeEmailService } from './compose-email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compose-email-temp',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss'],
})
export class ComposeEmailComponent implements OnInit {

  apiInProcess: boolean
  sendMailToAllForm: any
  editorConfig: AngularEditorConfig = {
    height: '200px',
    editable: true,
  }
  createCampaignInProcess: boolean;
  attachment: false;
  formData = new FormData();
  fileName: string;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private composeEmailService: ComposeEmailService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getSendMailToAllForm();
  }

  getSendMailToAllForm() {
    this.sendMailToAllForm = this.fb.group({
      campaignDescription: [null],
      campaign: [null, Validators.required],
      message: [null, Validators.required],
      subject: [null, Validators.required],
      attachment: [null]
    })
  }

  async createCampaign(body) {
    let res;
    this.createCampaignInProcess = true;
    try {
      if (body.message.includes('&lt;') && body.message.includes('&gt;')) {
        const templateCode = document.getElementsByClassName('angular-editor-textarea')[0] as HTMLElement;
        body.message = templateCode.innerText;
      }
      res = await this.composeEmailService.createCampaign({
        "campaign_name": body.campaign,
        "campaign_description": body.campaignDescription || 'No description provided',
        "message": body.message,
        "message_subject": body.subject,
      });
      if (body.attachment) {
        await this.composeEmailService.addAttachment({
          campaign_id: res.campaign_id,
          message_id: res.message_id,
          file: this.formData
        })
      }
      this.createCampaignInProcess = false;
      this.router.navigate(['settings/campaign-list']);
    }
    catch (error) {
      this.commonService.handleError(error);
    }
  }

  attachFile(files: File[]) {
    this.fileName = files[0].name;
    this.formData.append('attachment_file', files[0]);
  }

}
