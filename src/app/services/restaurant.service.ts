import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class RestaurantService {

  
  // private APIUrl ='http://54.144.74.77/api'
  // private APIUrl =  'http://localhost:5000/api'
  private APIUrl = 'https://restaurant-listing-app.herokuapp.com/api'

  constructor(
    private http: HttpClient,
    // private _router: Router,
    
    ) { }

    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     // Authorization: 'my-auth-token'
    //   })
    // };

  GetLocations (){

    return this.http.get<any>(this.APIUrl  + '/seed/location/')
  }
  GetCuisines (){

    return this.http.get<any>(this.APIUrl  + '/seed/cuisine/')
  }
  search (data){
    // console.log(data)
    return this.http.get<any>(this.APIUrl + `/search/${data}`)
  }

  advanceSearch (location,cuisine){
    // console.log(data)
    return this.http.get<any>(this.APIUrl + `/search/${location}/${cuisine}`)
  }

  Book(data){
    // console.log(data)
    return this.http.post<any>(this.APIUrl + '/restaurant/booking', data,
    {
      headers: new HttpHeaders().set(
        'Content-Type',  'application/json'
        
      )
    })
  }
   
}
