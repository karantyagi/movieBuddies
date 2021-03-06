import { Component, OnInit } from '@angular/core';
import {MovieEvent} from '../../models/movieEvent.model.client';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../services/event.service';
import {BookingService} from '../../services/booking.service';
import {UserService} from '../../services/user.service';
import {BookingDetail} from '../../models/bookingDetail.model.client';
import {User} from '../../models/user.model.client';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  event: MovieEvent;
  booked = false;
  eventId = '';
  user: User;
  host: User = new User();

  constructor(private eventService: EventService,
              private userService: UserService,
              private bookingService: BookingService,
              private route: ActivatedRoute, private router: Router) {
    this.booked = false;
    this.route.params.subscribe(param => {
      // console.log('PARAMS: ', param);
      this.eventId = param.eventId;
      console.log("Event ID: ", this.eventId);})
    this.fetchEventDetail(this.eventId);
    this.sessionCheck();

  }

  fetchEventDetail(eventId) {
    this.event = new MovieEvent();
    this.eventService.findEventById(eventId)
      .then((response) => {
        console.log("EVENT", response);
        this.event.name = response[0]['name'];
        this.event.location = response[0]['location'];
        this.event.movies = response[0]['movies'];
        this.event.time = response[0]['time'];
        this.event.date = response[0]['date'];
        this.event.id = response[0]['id'];
        this.event.user = response[0]['user'];
        this.userService.findUserById(this.event.user)
          .then((result) => {
            console.log('HOST ----> ', result);
            this.host = result;
          });
        // console.log("EVENT >>", this.event);
      })
  }

  bookEvent(){
    console.log('Create booking with event ID: ', this.event.id);
    this.booked = !this.booked;
    let b = new BookingDetail();
    b.eventId = this.eventId;
    b.event = this.event;
    b.tickets = '1';
    b.user = this.user['_id'];
    console.log('create booking', b);
    this.bookingService.createBooking(b)
      .then((response) => {
        console.log(response);
      })
  }


  // unbookEvent(){
  //   console.log('Delete booking for event ID: ', this.event.id);
  //   this.booked = !this.booked;
  //   // this.bookingService.deleteBooking(this.event.id)
  //   //   .then((response) => {
  //   //     console.log(response);
  //   //   })
  // }



  sessionCheck() {
    this.userService.findLoggedUser().then((user) => {
      if (user['username'] === 'No session maintained') {
        console.log('User not in session');
        this.user=null;
      }
      else {
        console.log('User in session : ', user['username']);
        console.log('ROLE : ', user['role']);
        this.user = user;
      }
    });
  }

  logout() {
    this.user.username = 'No session maintained';
    this.userService.logout().then(() => this.router.navigate(['/home']))
      .then(() =>
        this.userService.findLoggedUser().then((user) => {
            if (user['username'] === 'No session maintained') {
              console.log('User not in session');
            }
            else {
              console.log('User in session : ', user['username']);
              console.log('ROLE : ', user['role']);
            }
          }
        ));
  }


  ngOnInit() {
  }

}
