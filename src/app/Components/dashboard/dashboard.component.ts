import { Component, OnInit, ViewChild, ElementRef, Input, ɵɵgetInheritedFactory } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DishService } from './../../Services/dish.service';
import { AuthService } from './../../Services/auth.service';
import { IDish } from './../../Interfaces/dish.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('itemDetail', {static: true}) itemDetail!: ElementRef;

  public modalReference1: any = null;
  public modalReference2: any = null;
  public reviewReference: any = null;
  public foundDishes: any;
  public searchText: string;
  public results: any = [];
  public menu: any = [];
  public user;
  public dishCount: number = 0;
  public veganCount: number = 0;
  public nonVeganCount: number = 0;
  public modalReference: any = null;
  public selectedId: any; 
  public totalPrice!: { name: string, value: number };
  public powerstats: { name: string, value: number }[] = [];
  public totalMinutes: number = 0;
  public totalHealthScore: number = 0;
  public averageMinutes: number = 0;
  public averageHealthScore: number = 0;
  public show: number = 0;
  public errorAddDish = false;
  public successAddDish = false;
  public successDeleteDish = false;
  public addedCount: number = 0;
  public alertMessage: string;

  constructor(public formBuilder1: FormBuilder, public formBuilder2: FormBuilder, public DishService: DishService, public authService: AuthService, public modalService: NgbModal) {
    this.totalPrice = { "name": "Price", "value": 0 };
    this.selectedId = "1";
    this.user = JSON.parse(localStorage.getItem('token')!);
    this.searchText = '';
    this.foundDishes = [];
    this.alertMessage = '';
  }

  ngOnInit() {
    this.loadMenu();
  }

  public loadMenu(){
    this.addDish('1');
    this.addDish('2');
  }

  public tryLogout(){
  	this.authService.logout();
  }

  public trySearch(name: string){
    this.DishService.getDishByName(name).subscribe(data =>{
        this.foundDishes = data;
        this.results = this.foundDishes;
    });
  }

  public addDish(id: string){
    this.DishService.findDishById(id).subscribe(data =>{
      if(data.vegan){
        if(this.veganCount < 2){
          this.menu.push(data);
          const index = this.menu.findIndex((item: any)=> item.id == id);
            if(this.addedCount > 1){
              this.alertMessage = 'Added dish to the menu.';
              this.successAddDish = true;
            }
            this.addStats(index);
            this.addedCount++;
            this.dishCount++;
            this.veganCount++;
          }
          else{
            this.alertMessage = 'Reached max amount of vegan dishes';
            this.errorAddDish = true;
          }
        }
      else{
        if(this.nonVeganCount < 2){
          this.menu.push(data);
          const index = this.menu.findIndex((item: any)=> item.id == id);
            if(this.addedCount > 1){
              this.successAddDish = true;
            }
            this.addStats(index);
            this.addedCount++;
            this.dishCount++;
            this.nonVeganCount++;
          }
          else{
            this.alertMessage = 'Reached max amount of non vegan dishes';
            this.errorAddDish = true;
          }
        }

        this.calculateAverages();

        setTimeout(()=>{ 
          this.successAddDish = false;
          this.errorAddDish = false;
        }, 2000);
      });
   }

  public closeAddErrorAlert(){
    this.errorAddDish = false;
  }

  public closeAddSuccessAlert(){
    this.successAddDish = false;
  }

  public closeDeleteSuccessAlert(){
    this.successDeleteDish = false;
  }

  public deleteDish(id: string){
    const removeIndex = this.menu.findIndex((item: any)=> item.id === id);
    this.totalPrice.value -= Math.round((+this.menu[removeIndex].pricePerServing.toFixed(2) / 100));
    this.totalMinutes -= +this.menu[removeIndex].readyInMinutes;
    this.totalHealthScore -= +this.menu[removeIndex].healthScore;
    this.alertMessage = 'Removed dish from the menu.';
    this.successDeleteDish = true;
    this.dishCount -= 1;
    if(this.menu[removeIndex].vegan){
      this.veganCount--;
    }
    else{
      this.nonVeganCount--;
    }

    this.calculateAverages();
    this.menu.splice( removeIndex, 1 );
    setTimeout(()=>{ 
      this.successDeleteDish = false;
    }, 2000);
  }

  public addStats(index: number){
    this.totalPrice.value += Math.round((+this.menu[index].pricePerServing.toFixed(2) / 100));
    this.totalHealthScore += +this.menu[index].healthScore;
    this.totalMinutes += +this.menu[index].readyInMinutes;
    console.log("addstats: " + this.totalPrice.value, this.totalHealthScore, this.totalMinutes);
  }

  public calculateAverages(){
      this.averageHealthScore = this.totalHealthScore / this.dishCount;
      this.averageMinutes = this.totalMinutes / this.dishCount;
      if (Number.isNaN(this.averageHealthScore)){
        this.averageHealthScore = 0;
      }
      if (Number.isNaN(this.averageMinutes)){
        this.averageMinutes = 0;
      }
      console.log("avgs: " + this.averageHealthScore, this.averageMinutes);
  }

  public viewDishDetail(id: string){
    this.modalReference = this.modalService.open(this.itemDetail);
    this.selectedId = id;
  }

  public closeModal(){
  	this.modalReference.close();
  }

}
