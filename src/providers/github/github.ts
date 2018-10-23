import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GithubProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GithubProvider {


  api = 'http://10.30.191.202:8000/'

  constructor(public http: HttpClient) {
    console.log('Hello GithubProvider Provider');
  }

  async postIssue(title, description){
    let body = new FormData();
    body.append('title', title);
    body.append('description', description);
    let resp = this.http.post(this.api + 'issue', body).toPromise();
  }

  async getIssues(){
    let resp = this.http.get(this.api + 'issue').toPromise();
    return resp;
  }

}
