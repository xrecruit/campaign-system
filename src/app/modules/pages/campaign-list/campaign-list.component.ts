import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CampaignListService } from './campaign-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {

  constructor(private campaignListService: CampaignListService,
    private commonService: CommonService,
    private router: Router) { }

  campaignList: any
  apiInProcess: boolean
  popUpValue: any
  panelOpenState = true;
  expandCampaignList: Array<number>;

  ngOnInit() {
    this.getCampaignList();
  }

  async getCampaignList() {
    this.apiInProcess = true;
    try {
      const res = await this.campaignListService.getCampaignList();
      this.campaignList = res;
      this.expandCampaignList = new Array();
      this.campaignList.forEach((item, i) => {
        this.expandCampaignList.push(i);
        if (item.status.includes('Exception')) {
          item.status = item.status.split("'")[1];
        }
      })
      if (this.campaignList.length === 0) {
        this.popUpValue = ["Do not have any campaign available", true];
      }
      this.apiInProcess = false;
    }
    catch (error) {
      this.commonService.handleError(error);
      this.apiInProcess = false;
    }
  }

  openCampaign(campaign) {
    this.router.navigate(['settings/campaign-list/campaign-detail', campaign._id, campaign.Campaign_name]);
  }

  async removeCampaign(campaign) {
    try {
      const res = await this.commonService.openConfirmationBox("Are you sure ?");
      if (res == 'yes') {
        await this.campaignListService.deleteCampaing(campaign);
        this.campaignList = this.campaignList.filter((item) => {
          return item._id !== campaign._id;
        })
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async changeStatus(campaignDetail) {
    let status;
    try {
      if (campaignDetail.status === 'Running') {
        campaignDetail.status = 'Paused';
        status = 0;
      } else {
        campaignDetail.status = 'Running';
        status = 1;
      }
      const res = await this.campaignListService.changeCampaignStatus(campaignDetail, status);
      this.popUpValue = [res['message'], false]
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

}
