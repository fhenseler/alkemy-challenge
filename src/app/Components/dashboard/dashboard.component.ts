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

  constructor(public formBuilder1: FormBuilder, public formBuilder2: FormBuilder, public DishService: DishService, public authService: AuthService, public modalService: NgbModal) {
    this.totalPrice = { "name": "Price", "value": 0 };
    this.selectedId = "1";
    this.user = JSON.parse(localStorage.getItem('token')!);
    this.searchText = '';
    this.foundDishes = [];
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
      if(this.nonVeganCount < 2 && this.veganCount < 2){
        this.successAddDish = true;
        this.menu.push(data);
        console.log(data);
        const index = this.menu.findIndex((item: any)=> item.id == id);
        this.addStats(index);

        this.dishCount += 1;
        if(this.menu[index].vegan){
          this.veganCount++;
        }
        else{
          this.nonVeganCount++;
        }
        this.calculateAverages();
      }
      else{
          this.errorAddDish = true;
      }  
    });
    this.calculateAverages();
  }

  public deleteDish(id: string){
    const removeIndex = this.menu.findIndex((item: any)=> item.id === id);
    this.totalPrice.value -= +this.menu[removeIndex].pricePerServing;
    this.totalMinutes -= +this.menu[removeIndex].readyInMinutes;
    this.totalHealthScore -= +this.menu[removeIndex].healthScore;

    this.dishCount -= 1;
    if(this.menu[removeIndex].vegan){
      this.veganCount--;
    }
    else{
      this.nonVeganCount--;
    }

    this.calculateAverages();
    this.averageHealthScore = this.totalHealthScore / this.dishCount;
    this.averageMinutes = this.totalMinutes / this.dishCount;
    this.menu.splice( removeIndex, 1 );
  }

  public addStats(index: number){
    this.totalPrice.value += +this.menu[index].pricePerServing;
    this.totalHealthScore += +this.menu[index].healthScore;
    this.totalMinutes += +this.menu[index].readyInMinutes;
  }

  public calculateAverages(){
      this.averageHealthScore = this.totalHealthScore / this.dishCount;
      this.averageMinutes = this.totalMinutes / this.dishCount;
  }

  public viewDishDetail(id: string){
    this.modalReference = this.modalService.open(this.itemDetail);
    this.selectedId = id;
  }

  public closeModal(){
  	this.modalReference.close();
  }

}
