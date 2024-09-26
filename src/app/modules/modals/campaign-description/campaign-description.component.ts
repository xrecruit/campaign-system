import { Component, OnInit, Inject } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComposeEmailService } from '../../pages/compose-email/compose-email.service';
import { CommonService } from 'src/app/services/common.service';
import { CampaignListService } from '../../pages/campaign-list/campaign-list.service';


@Component({
  selector: 'app-campaign-description',
  templateUrl: './campaign-description.component.html',
  styleUrls: ['./campaign-description.component.scss']
})
export class CampaignDescriptionComponent implements OnInit {

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<any>,
    private composeEmailService: ComposeEmailService,
    private commonService: CommonService,
    private campaignListService: CampaignListService,
  ) {
  }

  editCampaignForm: any
  emailList: any;
  apiInProcess: any;
  campaignDetails: any;
  formData = new FormData();
  attachedFile: any;
  messageId: any;
  fileName: string;

  editorConfig: AngularEditorConfig = {
    height: '230px',
    editable: true,
  }

  ngOnInit() {
    this.getCampaignDetails();
  }

  async getCampaignDetails() {
    this.apiInProcess = true
    try {
      const res = await this.campaignListService.getCampaignList();
      this.campaignDetails = res.find(item => {
        return item._id == this.data.campaignDetail._id;
      });
      this.emailList = this.campaignDetails.message_detail;
      this.getEditCampaignForm();
      this.apiInProcess = false
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false
    }
  }

  getEditCampaignForm() {
    this.editCampaignForm = this.fb.group({
      campaignName: [this.campaignDetails.Campaign_name, Validators.required],
      campaignDescription: [this.campaignDetails.Campaign_description || null],
      attachment: [null],
      emails: [null],
      subject: [null],
      message: [null]
    })
  }

  getEmailPreview(email) {
    this.editCampaignForm.controls['subject'].setValidators([Validators.required]);
    this.editCampaignForm.controls['message'].setValidators([Validators.required]);
    this.getFromValue('emails').setValue(email);
    this.getFromValue('message').setValue(email.message);
    this.getFromValue('subject').setValue(email.message_subject);
    this.attachedFile = null;
    this.messageId = email.message_id;
    if (email.attachment_file_name) {
      this.attachedFile = email.attachment_file_name;
    }
  }

  getFromValue(formField) {
    return this.editCampaignForm.get(formField);
  }

  async removeAttachment() {
    try {
      await this.composeEmailService.delAttachment({ campaign_id: this.campaignDetails._id, message_id: this.messageId });
      this.attachedFile = null;
      this.emailList.find(item => item.message_id === this.messageId).attachment_file_name = null;
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async addAttachment() {
    try {
      await this.composeEmailService.addAttachment({
        campaign_id: this.campaignDetails._id,
        message_id: this.messageId,
        file: this.formData
      })
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  attachFile(files: File[]) {
    this.fileName = files[0].name;
    this.formData.append('attachment_file', files[0]);
  }

  async deleteEmail(email) {
    try {
      await this.campaignListService.deleteEmail({
        campaignId: this.campaignDetails._id,
        messageId: email.message_id
      })

      this.emailList = this.emailList.filter(item => item.message_id !== email.message_id);
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  sendDataToParent(formValue) {
    if (formValue.attachment) {
      this.addAttachment();
    }
    if (formValue.message) {
      if (formValue.message.includes('&lt;') && formValue.message.includes('&gt;')) {
        const templateCode = document.getElementsByClassName('angular-editor-textarea')[0] as HTMLElement;
        formValue.message = templateCode.innerText;
      }
    }
    this.dialogRef.close(formValue);
  }

  close() {
    this.dialogRef.close();
  }

}
