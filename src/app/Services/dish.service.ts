import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDish } from '../Interfaces/dish.interface';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class DishService {

    token: string = '057134cc3c014b6e9c02fbc7e8cd7a05';
    // url: string = "https://api.spoonacular.com/recipes/716429/information?apiKey=92fc5497d5944b69aebfe5caf0f21c74&includeNutrition=true";
    url: string = "https://api.spoonacular.com/";

	constructor(public http: HttpClient, public router: Router) { }

    public getDishByName(name: string):Observable<IDish[]>{
        // let direccion = this.url + this.token + '/search/' + name;
        // https://api.spoonacular.com/recipes/autocomplete?number=10&query=chick
        let direccion = this.url + 'recipes/autocomplete?number=10&query=' + name + '&apiKey=' + this.token;
        return this.http.get<IDish[]>(direccion);
    }

    public findDishById(id: string):Observable<IDish>{
        let direccion = this.url + 'recipes/' + id + '/information?apiKey=' + this.token;
        return this.http.get<IDish>(direccion);
    }

}