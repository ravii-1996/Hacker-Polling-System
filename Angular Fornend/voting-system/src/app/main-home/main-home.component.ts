
import { Candidates } from './../../interface/ICandidates';
import { LookupService } from './../lookup.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})
export class MainHomeComponent implements OnInit {

  //candidateList to store the details candidate list
  public candidateList :Candidates[];
  constructor(public lookupService : LookupService) {}

  private ROLE ={
    ADMIN: "admin",
    USER : "user"
  }

  editModaltxt={
    header: "Add",
    footer: "Close"
  };

  validateName= false;

  //dummy candidate for Add candiadte modal.
  newCandidate  :Candidates  ={
    "hacker_name": "",
    "total_challange_solved" : 0,
    "candidate_rating" : 0,
    "vote": 0,
    "expert_in" : {
      "data_structure" : 0,
      "algorithms" : 0,
      "java" : 0,
      "python" : 0,
      "node" :0,
      "angular" : 0
    }
  };
  public candidate :Candidates = this.newCandidate;
  private tempCandidate: Candidates= this.newCandidate ;

  //flag check only for vote once (also handle in backend)
  toggle= (localStorage.getItem('vote')=="true");

  candidateProfile(candidate : Candidates){
    this.candidate=candidate;
    this.newCandidate=candidate;
    this.toggleModalText("Edit", "Preview");
  }

  toggleModalText(txt, footer){
    this.editModaltxt.header=txt;
    this.editModaltxt.footer=footer;
    if(txt=="Add"){
      this.newCandidate=this.tempCandidate;
    }
  }


  /**
   * Calling an api for Vote
   * Localstorage flag change to false and disabled all button.
   */
   incrementVote(candidate : Candidates){
    if(localStorage.getItem('vote')==="true"){
      localStorage.setItem('vote',"false")
       this.lookupService.incrementVote(candidate).subscribe(
        res => {
        },
        error => {
          alert("You can Vote only Once");
        });
        alert("Thanks for your vote!")
        window.location.reload();
    }
    else
      alert("You can Vote only Once");
  }

  // Flag check to hide actions
  isUserAdmin(){
    return this.ROLE.ADMIN===localStorage.getItem('role');
  }

  // delete candidate api call
  deleteCandidate(candidate :Candidates){
    this.lookupService.deleteCandidate(candidate).subscribe((arg :any)=> {
      alert(arg.msg);
      window.location.reload();
    });
  }


  /**
   * We can use client site validation to make it more feasiable.
   * Add and update api call on the basis of type of text which we used in modal.
   * candidate name is unique key so we give prompt if name is not entered.
   */
  addUpdateCandidate(newCandidate, type){

    if(type==="Add"){
      if(newCandidate.hacker_name===""){
        alert("Name is required");
      }
      else{
        this.lookupService.addCandidate(newCandidate).subscribe((data)=>{
          alert("Candidate Added Succesfully");
          window.location.reload();
        });
      }
    }
    else{
      this.lookupService.updateCandidate(newCandidate).subscribe((data)=>{
        alert("Candidate Updated Succesfully");
        window.location.reload();
      })
    }
  }

  // Fetcch all component when component load.
  ngOnInit(): void {
    this.lookupService.getCandidates().subscribe(data => this.candidateList=data);
  }
}
