import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WeatherService} from "../shared/weather.service";
import {FormControl, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-angular4',
  templateUrl: './angular4.component.html',
  styleUrls: ['./angular4.component.css']
})
export class Angular4Component implements OnInit {

  message:string;
  data:string;

  lsObservable:string;
  lsPromise:string;

  searchField: FormControl;
  coolForm: FormGroup;


  code:string = `
  getLukeSkywalkerObservable(){
    return this.http.get('http://swapi.co/api/people/1/')
      .map(res => {
        return  res.json(); // using maps to filter data returned form the http call
      }).map(data => {
        return data; // using maps of maps to filter data returned form the map
      }).flatMap((jedi) => this.http.get(jedi.homeworld))
      .map(res => {
        return res.json().name; // using flat maps to combine data returned from two observables into one
      }).catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
`

  promsieCode:string = ` getLukeSkywalkerPromise(){
    return this.http.get('http://swapi.co/api/people/1/').toPromise()
      .then((data) => {
        console.log(data); // binding the result from the promise
        return data.json();
      }).then((data) => {
        console.log(data.name); // more like map of map but limited functionality
        return data.name;
      }).catch((ex) => {
          console.error('Server Error'+ex);
      })
  }
// In oreder to bind two promises what you can do is You can also call toPromise() on an Observable and convert it to a regular promise as well.
 // and then bind it using flat map as when we use in observables.
`;

  constructor(private route:ActivatedRoute,private weatherService:WeatherService,private fb:FormBuilder) {
    this.searchField = new FormControl();
    this.coolForm = fb.group({search: this.searchField});

    this.searchField.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.weatherService.getUser(term))
      .subscribe((result) => {
      });
  }

  ngOnInit() {

    this.weatherService.getLukeSkywalkerObservable().subscribe(res => {
        this.lsObservable = res;
    });

    this.weatherService.getLukeSkywalkerPromise().then((data) => {
      this.lsPromise = data;
    });

    this.message = this.route.snapshot.params['message'];
    this.data = this.route.snapshot.data['ping'];
    console.log("t"+this.data);

  }


  onChange(name:string){
    this.weatherService.getUser(name)
      .debounceTime(500)
      .distinctUntilChanged()

      .subscribe();
  }
}
