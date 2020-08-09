import { LookupService } from './../lookup.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private lookupService : LookupService,  private _router: Router) { }

  loginUserData = {
    email: "",
    password :""
  };

  ngOnInit(): void {
  }

  /**
   * Sending login details to backend for verification
   * If user verified then we store the role token and vote flag.
   * Role to ensure that end-user is admin or basic user (this help to hide the actions)
   * Vote flag ensure that user elgible for vote (aslo handle in backend part)
   * token to ensure who can access.
   */
  loginUser() {
    this.lookupService.loginUser(this.loginUserData)
    .subscribe(
      (res : any)=> {
        localStorage.setItem('token',res.token);
        localStorage.setItem('role',res.role);
        localStorage.setItem('vote',res.eligible_for_vote);
        this._router.navigate(['/welcome']);
      }
    )
  }

}
