import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageSmtpService {

  constructor(
    private http: HttpClient
  ) { }

  getSmtpList() {
    return this.http.get(`${environment.mailsystembaseapiurl}/smtp/settings/CAMPAIGN`).toPromise();
  }

  deleteSmtp(id): Promise<any> {
    return this.http.delete(`${environment.mailsystembaseapiurl}/smtp/settings/CAMPAIGN/${id}`).toPromise();
  }

  changePriorityOfSmtp(body): Promise<any> {
    return this.http.post(`${environment.mailsystembaseapiurl}/smtp/smtp_priority/${body.id}/${body.position}`, '').toPromise();
  }

  changePassword(body): Promise<any> {
    return this.http.put(`${environment.mailsystembaseapiurl}/smtp/update_settings/CAMPAIGN/${body.smtpId}`, { new_password: body.password }).toPromise();
  }

}
