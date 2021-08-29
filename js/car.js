var km = 200000
var no_of_cars = 5

class Road{
    constructor(km){
        this.km = km
    }
}

class Car extends Road{
    constructor(acc, color, max_speed, break_power, player, km, x, y){
        super(km)
        this.acc = acc;
        this.color = color;
        this.max_speed = max_speed;
        this.break_power = break_power
        this.init_speed = 0
        this.car_speed = 0
        this.racingSpeed = 0
        this.player = player
        this.x = x
        this.y = y
        this.width = 20
        this.height = 20
        this.image = 20
    }

    move(){
        if(this.racingSpeed >= this.km) return
        if(this.init_speed >= this.max_speed) return
        this.init_speed += this.acc
    }

    go(move){
        if(this.racingSpeed >= this.km){
            this.init_speed = 0
            return
        } 
        if(move){
            this.racingSpeed += this.init_speed
            this.y -= (this.init_speed / 300)
        }
            // console.log("you have finished the race congratulation")
    }

    // driveAi(myCar){
    //     if(this.racingSpeed >= this.km){
    //         this.init_speed = 0
    //         return
    //     } 
    //     this.racingSpeed += ( this.init_speed - myCar.init_speed )//this.init_speed
    //     console.log( this.init_speed - myCar.init_speed )
    //     let move = (this.init_speed - myCar.init_speed) / 300
    //     console.log(move)
    //     this.y -= this.init_speed
    // }
    stop(){
        if(this.init_speed <= 0) return  
        this.init_speed -= this.break_power
        if(this.init_speed <= 0) this.init_speed = 0  
        
    }
    left(){
        this.x = this.x - 1
    }
    right(){
        this.x = this.x + 1
    }
}

var canvas = document.getElementById("carFrame");
// Get the 2d context for this canvas
var ctx = canvas.getContext("2d");
let height = window.innerHeight

class Game{
constructor(no_of_cars, canvas_height, canvas_width ){
this.cars = []
this.pos = [];
this.finallist = [];
this.requestRate = 0
this.no_of_cars = no_of_cars
this.images = []
this.generateCars()
this.height = canvas_height
this.width = canvas_width
this.imageLoader()
this.move_road = 0
this.drawComponents(this.cars, this.height, this.width)
this.awaitGame()
this.move_camera = 0
}

startGame = () => {
this.controls()
this.animateGame()
}

imageLoader = () =>{
let loaded = true;
let loadedImages = 0;
let totalImages = 0;
var load = function(url) {
        totalImages++;
        loaded = false;
        var image = new Image();
        image.src = url;
        image.onload = function() {
        loadedImages++;
        if (loadedImages === totalImages) {
            loaded = true;
        }
            image.onload = undefined;
        }
        return image;
    }
    let road = load(`./static/road.jpg`)
    let road_obj = {
        image: road,
        x: 0,
        y: -450,
        width: this.width,
        height: this.height * 4 
    }
    this.images.push(road_obj)
    let car_spacing = 10
    for(let i = 0; i < this.cars.length; i++){
        let car = load(`./static/${this.cars[i].color}.jpg`)
        car_spacing += 30
        this.cars[i].image = car
        this.cars[i].width = 20;
        this.cars[i].height = 30;
        this.cars[i].x = car_spacing;
        this.cars[i].y = this.height - this.cars[i].height - 3
        this.images.push(this.cars[i])
    }

}

drawComponents(cars, height, width){
for(let i = 0; i < this.images.length; i++){
    if(i == 0) ctx.clearRect(0, 0, height, width)
    ctx.drawImage(this.images[i].image, this.images[i].x, this.images[i].y, this.images[i].width, this.images[i].height);
}
}

controls(){
document.addEventListener('keydown', (event)=>{
    switch(event.keyCode){
        case 37:
        this.cars[this.cars.length-1].left()
        // alert("left") 
        break;
        case 38:
        this.cars[this.cars.length-1].move()
        // this.images[0].y -= 1
        // console.log(this.images[0].y)
        //     console.log(this.cars[this.cars.length-1].init_speed)
        break;
        case 39:
        this.cars[this.cars.length-1].right()
        // alert("right") 
        break;
        case 40:
        this.cars[this.cars.length-1].stop()
            console.log(this.cars[this.cars.length-1].init_speed)
        break;
        
    }
})
}

collisions(anime){
for(let i = 0; i < this.cars.length; i++){
    if(this.cars[i].racingSpeed >= this.cars[i].km){
        console.log("true pass")
        let thatElem = this.cars.splice(i, 1)
        this.finallist.push(thatElem[0]) 
        console.log(this.finallist)
        // window.cancelAnimationFrame(anime)   
        return
    }
}
// if(!this.cars){
// }

for(let i = 0; i < this.cars.length; i++){
    for(let j = 0; j < this.cars.length; j++){
        if(i == j) continue
        if(this.cars[j].x > (this.cars[i].x - this.cars[i].width) && this.cars[j].x < (this.cars[i].x + this.cars[i].width)){
            this.cars.splice(j, 1)
            this.cars.splice(i, 1);
        }
        else{
            console.log("no collision")
        }
    } 
}


}
calcPlayerPos(){
this.pos = []
for(let i = 0; i < this.cars.length; i++){
    this.pos.push({racing: this.cars[i].racingSpeed, km: this.cars[i].km , color: this.cars[i].color,  player: this.cars[i].player })
}

function compare( a, b ) {
    if ( a.racing < b.racing ){
        return -1;
    }
    if ( a.racing > b.racing ){
        return 1;
    }
    return 0;
}

this.pos.sort( compare ).reverse();
console.log(this.pos)
let acc_for_cars = this.no_of_cars - this.pos.length
for(let i = 0; i < this.no_of_cars; i++){
    if(this.pos[i].player == "human"){
        console.log(`you are in the ${this.pos[i].color} ${i + 1 + acc_for_cars} out of ${this.pos.length + acc_for_cars}, you are at ${this.pos[i].racing} out of ${this.pos[i].km}`)
    }
    // console.log(this.pos[i].racing >= km)
    // console.log(this.pos[i].racing)

    //         console.log(this.pos)
}

// this.cars.sort( compare ).reverse();


    
}

hasRaceEnded = (timeLoop) => {
console.log(this.pos)
// console.log(this.km)
if(this.pos.length){
    let isEnded = this.pos.every((car) => car.racing >= car.km)// {
    console.log(isEnded)
    if(isEnded){
        console.log("the race has ended the " + this.pos[0].color + " car won")
        window.cancelAnimationFrame(timeLoop)
        return true   // console.log(endOfRaceList)
    }
}
    return false
}

generateCars(){
// this.cars = []
// let endOfRaceList = []
let car_colors = ["red", "orange", "green", "purple", "yellow", "magenta", "white", "brown", "pink", "blue"]
let pos = {
    x: 0,
    y: 0
}
for(let i = 0; i < this.no_of_cars; i++){
    let color_index = Math.floor(Math.random() * car_colors.length)
    let color = car_colors.splice(color_index, 1)[0] 
    let acceleration = Math.floor(Math.random() * 5) + 5
    let max_speed = Math.floor(Math.random() * 60) + 60
    let break_power = Math.floor(Math.random() * 15) + 5
    let compCar = new Car(acceleration, color, max_speed, acceleration, "computer", km, pos.x, pos.y)
    this.cars.push(compCar)
} 

var myCar = new Car(5, "red", 90, 15, "human", km, pos.x, pos.y) 
this.cars.push(myCar)
}

acc_all_cars(){
for(let i = 0; i < this.cars.length; i++){
    // if(i == (this.cars.length - 1)){
        this.cars[i].go()
    // }
    // else{
        // this.cars[i].driveAi(this.cars[this.cars.length - 1])
    // }

}
}

camera(){
let myCar = this.cars[this.cars.length - 1]
// let go_back = 0
// if(go_back > 0) (this.images[0].height - 300)
if(this.images[0].y >= -120){
    this.images[0].y = -450
}
else{
    this.images[0].y += 0.1
}
if(myCar.y <= 60){
    this.move_camera = 400
    for(let i = 0; i < this.cars.length; i++){
        this.cars[i].y += 1.1
        // this.images[0].y += 0.1//this.move_road
    
    }
}
else{
    this.move_camera -= 8
    if(this.move_camera < 1){
        for(let i = 0; i < this.cars.length; i++){
            this.cars[i].go(true)
            // this.images[0].y -= 0.1
        }
    }
    else{
        for(let i = 0; i < this.cars.length; i++){
        this.cars[i].y += 0.1
        // this.images[0].y += 0.1
        }
    }
}
//     if(this.move_road <= -145) this.move_road = -1
//     // alert(myCar)
//     this.move_road -= myCar   
}   
aiAction(){
for(let i = 0; i < this.cars.length - 1; i++){
    let move = Math.round(Math.random());
    let stop = Math.round(Math.random() * 5)
        if(move == 1){
            this.cars[i].move()
        }
        if(stop == 5){
            this.cars[i].stop()
        }
    }
}

animateGame = () => {
    this.drawingLoop()
    window.requestAnimationFrame(this.drawingLoop)
}

drawingLoop = () => {
    this.requestRate += 1
    this.aiAction()  
    this.camera()
        let animeId = window.requestAnimationFrame(this.drawingLoop)
        
        if(this.requestRate >= 100){
            this.requestRate = 0         
            this.calcPlayerPos() 
            let didRaceEnd = this.hasRaceEnded(animeId)  
            if(didRaceEnd) return

        }
            this.collisions(animeId)
            // this.acc_all_cars()
            // this.camera()
            // this.images[0].y = this.move_road
    
            this.drawComponents(this.cars, this.height)
        }


awaitGame(){
    let time = 0
    let t = setInterval(() =>{
        time += 1
        console.log(`the race is starting in ${3 - time} seconds`)
        if(time == 3){
            this.startGame()
            clearInterval(t)
        } 
    }, 1000)

}
}

let start_game = new Game(no_of_cars, canvas.height, canvas.width)