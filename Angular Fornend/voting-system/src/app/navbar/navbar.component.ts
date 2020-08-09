import { LookupService } from '../lookup.service';
import { Component, OnInit } from '@angular/core';
import { tokenName } from '@angular/compiler';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public lookupService: LookupService) { }
  ngOnInit(): void {
  }

  //promp appear if not logged in
  promptFun(){
    if(!this.lookupService.loggedIn())
      alert("Please Login First!")
  }

}
