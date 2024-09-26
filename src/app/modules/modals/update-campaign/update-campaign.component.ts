import { Component, OnInit, Inject } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { CampaignListService } from '../../pages/campaign-list/campaign-list.service';
import { ComposeEmailService } from '../../pages/compose-email/compose-email.service';

@Component({
  selector: 'app-update-campaign',
  templateUrl: './update-campaign.component.html',
  styleUrls: ['./update-campaign.component.scss']
})
export class UpdateCampaignComponent implements OnInit {

  updateCampaignForm: any;
  templateList: any;
  apiInProcess: boolean;
  templateId: any;
  templateOptions = new Array(3);
  popUpValue: any;
  updateEmailFrom: any;
  fileName: string;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<any>,
    private commonService: CommonService,
    private campaignListService: CampaignListService,
    private composeEmailService: ComposeEmailService) {
  }

  editorConfig: AngularEditorConfig = {
    height: '230px',
    editable: true,
  }
  formData = new FormData();

  ngOnInit() {
    if (this.data.campaign.generated_from_recruit)
      this.getTemplateList();
    this.getUpdateEmailFrom();
  }

  getUpdateCampaignForm() {
    this.updateCampaignForm = this.fb.group({
      template1: [null, Validators.required],
      template2: [null], template3: [null],
      message1: [null], message2: [null],
      message3: [null], subject1: [null],
      subject2: [null], subject3: [null]
    })
    if (this.templateList.length === 0)
      this.popUpValue = ['All templates are already assigned', true];
  }

  async getTemplateList() {
    this.apiInProcess = true
    try {
      const campaignDetail = await this.campaignListService.campaignDetails(this.data.campaign._id);
      const res = await this.campaignListService.getTemplateList();
      this.templateList = res;
      if (campaignDetail.Template) {
        campaignDetail.Template.forEach(item => {
          this.templateList = this.templateList.filter(template => template._id !== item);
        })
      }
      this.apiInProcess = false;
      this.getUpdateCampaignForm();
    } catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false;
    }
  }

  getTemplatePreview() {
    for (let i = 0; i < this.templateOptions.length; i++) {
      if (this.getFormValue(['template' + (i + 1)]).value) {
        const templateValue = this.getFormValue('template' + (i + 1)).value;
        this.getFormValue('message' + (i + 1)).setValue(templateValue.message);
        this.getFormValue('subject' + (i + 1)).setValue(templateValue.message_subject);
      }
    }
  }

  getUpdateEmailFrom() {
    this.updateEmailFrom = this.fb.group({
      subject: [null, Validators.required],
      message: [null, Validators.required],
      attachment: [null]
    })
  }

  getFormValue(formField) {
    return this.updateCampaignForm.get(formField);
  }

  sendDataToParent(formValue) {
    let messageDetails = new Array();
    for (let i = 0; i < this.templateOptions.length; i++) {
      if (formValue['message' + (i + 1)]) {
        messageDetails.push({
          "message": formValue['message' + (i + 1)],
          "message_subject": formValue['subject' + (i + 1)]
        })
      }
    }
    this.dialogRef.close(messageDetails);
  }

  assignSingleEmail(formValue) {
    this.dialogRef.close(
      [{ "message": formValue.message, "message_subject": formValue.subject, "attachment": formValue.attachment, "formData": this.formData }]
    )
  }

  attachFile(files: File[]) {
    this.fileName = files[0].name;
    this.formData.append('attachment_file', files[0]);
  }

  close() {
    this.dialogRef.close();
  }

}
