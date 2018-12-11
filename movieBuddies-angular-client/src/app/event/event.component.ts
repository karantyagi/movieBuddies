import { Component, OnInit } from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {EventService} from '../services/event.service';
import {MovieEvent} from '../models/movieEvent.model.client';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  latestEvents : MovieEvent[] = [];

  constructor(private eventService: EventService,
              private userService: UserService,  private route: ActivatedRoute) {
    this.fetchAllEvents();
  }

  fetchAllEvents(){
    this.latestEvents = [];
    this.eventService.findAllEvents()
      .then((response) => {
        // console.log('Response', typeof pp);
        // console.log(pp);
        response.forEach((e) => {
          const m = new MovieEvent();
          m.name = e['name'];
          m.time = e['time'];
          m.date = e['date'];
          m.id = e['_id'];
          m.location = e['location'];
          m.maxTickets = e['maxTickets'];
          m.movies = e['movies'];
          m.hostId = e['user'];
          this.latestEvents = this.latestEvents.concat(m);
        });

        //   m.id = movie.id;
        //   m.title = movie.title;
        //   m.release_date = movie.release_date;

        console.log(this.latestEvents);
      })
  }

  ngOnInit() {
  }

}
