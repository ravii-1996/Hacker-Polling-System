import { Candidates } from './../interface/ICandidates';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private api : ApiService, private _router: Router ) { }

  // check for token exist or user logged in
  loggedIn() {
    return !!localStorage.getItem('token')
  }

  // check for token
  getToken(){
    return localStorage.getItem('token');
  }

  /**
   * when we logout we clean the local storage
   */
  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('vote');
    this._router.navigate(['/'])
  }

  // Below are the api call passing to the api service class.

  getCandidates() : Observable<Candidates[]>{
    return this.api.getCandidates()
  }

  incrementVote(candidate){
    return this.api.incrementVote(candidate);
  }


  loginUser (loginUserData){
    return this.api.loginUser(loginUserData);
  }

  deleteCandidate(candidate : Candidates){
    return this.api.deleteCandidate(candidate);
  }

  addCandidate(newCandidate :Candidates){
    return this.api.addCandidate(newCandidate);
  }

  updateCandidate(candidate :Candidates){
    return this.api.updateCandidate(candidate);
  }
}
