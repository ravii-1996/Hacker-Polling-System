import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import {Candidates} from '../interface/ICandidates';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  //private baseurl: string = "http://localhost:4000"; // server api url
  private baseurl: string ="https://hacker-poll-node.herokuapp.com";

  getCandidates(): Observable<Candidates[]>{
    return this.http.get<any>(this.baseurl + "/api/getCandidates");
  }

  incrementVote(candidate){
    return this.http.patch(this.baseurl + "/api/incrementVote", candidate);
  }

  loginUser(loginUserData){
    return this.http.post(this.baseurl + "/api/login",loginUserData);
  }

  deleteCandidate(candidate){
    return this.http.post(this.baseurl + "/api/delete", candidate);
  }
  addCandidate(newCandidate){
    return this.http.post(this.baseurl + "/api/addCandidate", newCandidate);
  }

  updateCandidate(candidate){
    return this.http.put(this.baseurl + "/api/updateCandidate", candidate);
  }
}
