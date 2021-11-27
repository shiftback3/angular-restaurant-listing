import { RestaurantService } from './services/restaurant.service';
import { AfterViewInit,QueryList, ViewChildren, Component, OnInit } from '@angular/core';
import {DecimalPipe} from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';


import {Observable} from 'rxjs';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RestaurantService, DecimalPipe]
})
export class AppComponent implements  OnInit{
processing = true
processing_search = true
  searchParams = ''
  locationParams = ''
  cuisineParams = ''
  booking!: FormGroup
  title = 'restaurant-app';
  copyDate : Date = new Date();
  meridian = true;

  locations = <any> []
  cuisines = <any> []

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  restaurants = <any> []
  bookingdate : NgbDateStruct;
  bookings = <any> [
    
  ]
  restaurantDetails = <any> []

  constructor(
    private fb: FormBuilder,
    private _service: RestaurantService,
    private modalService: NgbModal,
    private calendar: NgbCalendar
  ){
    this.refreshRestaurants();
   }
   
   isDisabled = (date: NgbDate, current: {month: number, year: number}) => date.month !== current.month;
  isWeekend = (date: NgbDate) =>  this.calendar.getWeekday(date) >= 6;

  ngOnInit(): void {
    this.getLocations()
    this.getCuisines()
    this.booking = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      guest: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      time: ['', Validators.compose([Validators.required])],
      // restaurant_id: [this.restaurantDetails._id, Validators.compose([Validators.required])],
    })
  }

  getLocations(){
    this._service.GetLocations()
    .subscribe(
      res =>{

this.locations = res.data
console.log(this.locations)
      },
      err => {
        console.log(err)
      }
    )
  }

  getCuisines(){
    this._service.GetCuisines()
    .subscribe(
      res =>{

this.cuisines = res.data
console.log(this.cuisines)
      },
      err => {
        console.log(err)
      }
    )
  }
  searchRestaurant(){
    this.processing_search = false
    this._service.search(this.searchParams)
    .subscribe(
      res =>{
 this.collectionSize = res.response.length;
this.restaurants = res.response
this.refreshRestaurants()
this.processing_search = true
if(res.response.length < 1){
  alert('No Result Found!')
}
console.log(res)
      },
      err => {
        this.processing_search = true
        console.log(err)
      }
    )

  }

  RestaurantCuisine(){
    this.processing = false
    if((this.locationParams =='') && (this.cuisineParams =='')){
alert('Please select one field at least')
this.processing = true
    }
    if((this.locationParams !='') && (this.cuisineParams !='')){
    this._service.advanceSearch(this.locationParams,this.cuisineParams)
    .subscribe(
      res =>{
 this.collectionSize = res.response.length;
this.restaurants = res.response
this.refreshRestaurants()
this.processing = true
if(res.response.length < 1){
  alert('No Result Found!')
}
console.log(res)
      },
      err => {
        console.log(err)
        this.processing = true
      }
    )
    }
    if((this.locationParams =='') && (this.cuisineParams !='')){
      this._service.search(this.cuisineParams)
      .subscribe(
        res =>{
   this.collectionSize = res.response.length;
  this.restaurants = res.response
  this.refreshRestaurants()
  this.processing = true
  if(res.response.length < 1){
    alert('No Result Found!')
  }
  console.log(res)
        },
        err => {
          console.log(err)
          this.processing = true
        }
      )
      }

      if((this.locationParams !='') && (this.cuisineParams =='')){
        this._service.search(this.locationParams)
        .subscribe(
          res =>{
     this.collectionSize = res.response.length;
    this.restaurants = res.response
    this.refreshRestaurants()
    this.processing = true
    if(res.response.length < 1){
      alert('No Result Found!')
    }
    console.log(res)
          },
          err => {
            console.log(err)
            this.processing = true
          }
        )
        }
  }

  refreshRestaurants() {
    this.restaurants
      .map((restaurant, i) => ({id: i + 1, ...restaurant}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openBackDropCustomClass(content,data) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop',size: 'lg'});
    // console.log(data)
    this.restaurantDetails = data
  }
  book(){

    this.processing = false
    
    // this.restaurantDetails 
    this.booking.addControl('restaurant_id', new FormControl(this.restaurantDetails._id, Validators.required));
    this._service.Book(this.booking.value)
    .subscribe(
      res =>{
        this.processing = true
alert('Booking Successful, check email for details!')

console.log(res)
      },
      err => {
        this.processing = true
        console.log(err)
      }
    )
  }
}


