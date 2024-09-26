import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampaignListService {

  constructor(private http: HttpClient) { }

  private eventValue = new Subject<any>();

  setEventValue(event) {
    this.eventValue.next(event);
  }

  getEventValue(): Observable<any> {
    return this.eventValue.asObservable();
  }

  getCampaignList(): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/list_campaign`).toPromise();
  }

  deleteCampaing(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/delete_campaign/${body._id}`).toPromise();
  }

  editCampaignDetails(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/update_campaign/${body.id}`, body.campaignDetails).toPromise();
  }

  deleteEmail(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/update_campaign/${body.campaignId}/${body.messageId}`).toPromise();
  }

  campaignDetails(body): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/campaign_detail/${body}`).toPromise();
  }

  getTemplateList(): Promise<any> {
    return this.http.get(`${environment.mailsystembaseapiurl}/message/get_email_template/CAMPAIGN`).toPromise();
  }

  // assignTemplate(body): Promise<any> {
  //   return this.http.put(`${environment.mailsystembaseapiurl}/assign_template/${body.campaign_id}`, body.template).toPromise();
  // }

  sendMail(body, id): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/campaign_mails/${id}`, body).toPromise();
  }

  assignUser(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/user_list_campaign`, body).toPromise();
  }

  changeCampaignStatus(campaign, status): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/pause_campaign/${campaign._id}/${status}`, '').toPromise();
  }

  sendTestMail(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/campaign_smtp_test`, body).toPromise();
  }

  deleteUser(body): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/user_delete_campaign/${body.campaignId}/${body.userId}`).toPromise();
  }

  validateUser(campaign): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/validate_users/${campaign._id}`, '').toPromise();
  }


  downloadFile(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, ['name', 'email']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

}
