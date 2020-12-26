var dog,dogImg,happyDog;
var database;
var foodS,foodStock,foodObj;
var feed,addFood;
var fedTime,lastFed;
var readState,changeState;
var gameState;
var bedroomImg,gardenImg,washroomImg;
function preload(){
   dogImg=loadImage("images/Dog.png");
   happyDog=loadImage("images/dogImg1.png");
   bedroomImg=loadImage("images/Bed Room.png");
   gardenImg=loadImage("images/Garden.png");
   washroomImg=loadImage("images/Wash Room.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  dog=createSprite(600,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

}

// function to display UI
function draw() {
  background(46,139,87);
  currentTime=hour();
  if (currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if (currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else {
    update("Hungry");
    foodObj.display();
  }
  if (gameState!= "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else {
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  if (lastFed>=12){
    text("Last Feed :"+lastFed%12 + "PM",350,30);
  }
  else if (lastFed===0){
    text("Last Feed : 12 AM",350,30);
  }
  else{
    text("Last Feed:"+lastFed +"AM",350,30);
  }
  
   
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,50);
  textSize(13);
  
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
    
  
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}
function feedDog(){
dog.addImage(happyDog);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
Food:foodObj.getFoodStock(),
FeedTime:hour()
})
}
function addFoods(){
foodS++;
database.ref('/').update({
Food:foodS
})
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}