'use strict';

// prettier-ignore


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map , mapEvent;

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10)

    constructor(coords , distans , duration) {
        this.coords = coords;
        this.distans = distans;
        this.duration = duration;
    }

    _setDiscription() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.discription = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]}
        ${this.date.getDate()}`
    }

}

class Running extends Workout {
    type = 'running';
    constructor (coords , distans , duration , cadence) {
        super(coords , distans , duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDiscription()
    }

    calcPace() {
        this.pace = this.distans / this.duration;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = 'cycling';
    constructor (coords , distans , duration , elevationGain) {
        super(coords , distans , duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDiscription()
    }

    calcSpeed () {
        this.speed = this.distans / (this.duration / 60);
        return this.speed;
    }
}

class App {
    #map;
    #mapEvent;
    #workout = [];

    constructor() {
        this._getPosition()
        form.addEventListener('submit' , this._newWorkout.bind(this))
        
        inputType.addEventListener('change' , this._toggelEventFildes);
    }

    _getPosition() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this) , function (error) {alert('can not fide location')});
        }
    }

    _loadMap(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coords = [latitude , longitude];
        
        this.#map = L.map('map').setView(coords, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        this.#map.on('click' , this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus();
    }

    hiddeForm() {
        inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value ='';
        form.style.display = 'none'
        form.classList.add('hidden')
        setTimeout( () => form.style.display = 'grid' , 1000)
    }

    _toggelEventFildes() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
    
        const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allposetive = (...inputs) => inputs.every(inp => inp > 0)
        
        e.preventDefault();
        //get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat , lng} = this.#mapEvent.latlng;
        let workout;

        //if workout Running creat Running object
        if (type ==='running') {
            const cadence = +inputCadence.value;
             //check data valid
             if(!validInput(distance , duration , cadence) || !allposetive(distance , duration , cadence))
              return alert('most be posetive Number')
             workout = new Running({lat , lng} , distance , duration , cadence );
        }

        //if workout Cycling creat Cycling object
        if (type ==='cycling') {
            const elevation = +inputElevation.value;
            //check data valid
            if(!validInput(distance , duration , elevation) || !allposetive(distance , duration))
            return alert('most be posetive Number');
            workout = new Cycling({lat , lng} , distance , duration , elevation );

        }

        //add new object to workout array
        this.#workout.push(workout);

        //render workout on map as mark
        this.renderWorkuotMark(workout);

        //render sidebar 
        this._renderWorkuot(workout);
        //hidde inupt
        this.hiddeForm();
        
    }

    renderWorkuotMark(workout) {
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({
            minWidth : 100,
            maxWidth : 250,
            autoClose : false,
            closeOnClick : false,
            className : `${workout.type}-popup`
        })).setPopupContent(workout.distance)
        .openPopup()
    }

    _renderWorkuot(workout) {
        let HTML =  `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.discription}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          `
          if(workout.type === 'running') 
          HTML += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
        `
        if(workout.type === 'cycling') 
        HTML += `
        <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">m</span>
      </div>
    </li> -->
        `
        form.insertAdjacentHTML('afterend', HTML);
    }
}

const app = new App();

