import { Component, OnInit } from '@angular/core';
import { UnsubscribeUsersService } from './unsubscribe-users.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-unsubscribe-users',
  templateUrl: './unsubscribe-users.component.html',
  styleUrls: ['./unsubscribe-users.component.scss']
})
export class UnsubscribeUsersComponent implements OnInit {

  constructor(private unsubscribeUserService: UnsubscribeUsersService,
    private commonService: CommonService) { }

  unsubscribedUserList: Array<object>;
  apiInProcess: boolean;
  limit: number = 50;
  page: number = 1;
  totalUsers: number;
  lastPage: number;
  popUpValue: any;

  ngOnInit() {
    this.getUnsubscribedUserList();
  }

  async getUnsubscribedUserList() {
    try {
      this.apiInProcess = true;
      const res = await this.unsubscribeUserService.unsubscribedUserList({
        skip: (this.page - 1),
        limit: this.limit
      });
      if (res && res.list) {
        if (res.list.length === 0) {
          this.popUpValue = ['Do not have unsubscribed users.', true];
        }
        this.unsubscribedUserList = res.list;
        this.totalUsers = res.totalUnsub;
        this.lastPage = Math.ceil(this.totalUsers / this.limit);
      }
    } catch (error) {
      this.commonService.handleError(error);
    }
    this.apiInProcess = false;
  }

  previous() {
    this.page--;
    this.getUnsubscribedUserList();
  }

  next() {
    this.page++;
    this.getUnsubscribedUserList();
  }

}
