;(function(){
  const ctx = document.getElementById('canvas').getContext('2d')
  class Random{
    static get(inicio, final){
      return Math.floor(Math.random() * final) + inicio
    }
  }

  class Food{
    constructor(x,y){
      this.x = x
      this.y = y
      this.width = 10
      this.height = 10
    }

    draw(){
      ctx.fillRect(this.x, this.y,this.width, this.height)
    }

    static generate(){
      const x = Random.get(0,600)
      const y = Random.get(0,400)
      return new Food(x,y)
    }
  }

  class Square{
    constructor(x, y){
      this.x = x
      this.y = y
      this.speed = 10
      this.width = 10
      this.height = 10
      this.lastSquare = null
    }

    copy(){
      if(this.hasBack()){
        this.lastSquare.copy()
        this.lastSquare.x = this.x
        this.lastSquare.y = this.y
      }
    }

    right(){
      this.copy()
      this.x += this.speed
    }
    left(){
      this.copy()
      this.x -= this.speed
    }
    up(){
      this.copy()
      this.y -= this.speed
    }
    down(){
      this.copy()
      this.y += this.speed
    }

    addNew(){
      if(this.hasBack()){
        this.lastSquare.addNew()
      } else {
          this.lastSquare = new Square(this.x - (this.width + 5), this.y)
      }
    }

    hasBack(){
      return this.lastSquare !== null
    }

    draw(){
      ctx.fillRect(this.x, this.y, this.width, this.height)
      if(this.hasBack()) this.lastSquare.draw()
    }

    hit(square, second=false){
      if(square === this && !this.hasBack()) return false
      if(square === this) return this.lastSquare.hit(square, true)

      if(second && !this.hasBack()) return false
      if(second)return this.lastSquare.hit(square)

      //Is not a head and not is the second
      if(this.hasBack()) return snakeHit(this, square) || this.lastSquare.hit(square)

      //Is not a head and not is the second, but is the last
      return snakeHit(this, square)
    }

    hitBorder(){
    return this.x > 490 || this.x < 0 || this.y > 290 || this.y < 0
    }

  }

  class Snake{
    constructor(){
      this.head = new Square(0, 0)
      this.draw()
      this.eat()
      this.eat()
      this.eat()
      this.eat()
      this.eat()
      this.eat()
      this.eat()
      this.direction  = "right"
    }

    right(){
      if(this.direction == "left") return;
      this.direction = "right"
    }
    left(){
      if(this.direction == "right") return;
      this.direction = "left"
    }
    up(){
      if(this.direction == "down") return;
      this.direction = "up"
    }
    down(){
      if(this.direction == "up") return;
      this.direction = "down"
    }

    eat(){
      this.head.addNew()
    }

    move(){
      if(this.direction === "up") return this.head.up()
      if(this.direction === "down") return this.head.down()
      if(this.direction === "left") return this.head.left()
      if(this.direction === "right") return this.head.right()
    }

    draw(){
      this.head.draw()
    }

    dead(){
      return (this.head.hit(this.head) || this.head.hitBorder())
    }
  }

  const snake = new Snake()
  let foods = []

  window.addEventListener("keydown", (event)=>{
    if(event.keyCode > 36 && event.keyCode < 41) event.defaultPrevented
    if(event.keyCode == 40) snake.down()
    if(event.keyCode == 39) snake.right()
    if(event.keyCode == 38) snake.up()
    if(event.keyCode == 37) snake.left()
    return false;
  })

  setInterval(()=>{
    const food = Food.generate()
    foods.push(food)
    setTimeout(()=>{
      removeFromFoods(food)
    },10000)
  }, 2000)

  const gameInterval = setInterval(()=>{
    snake.move()
    ctx.clearRect(0,0,800, 600)
    drawFood()
    snake.draw()
    if(snake.dead()){
      window.clearInterval(gameInterval)
    }
  }, 100)

  function drawFood() {
    for(var food_index in foods){
      const food = foods[food_index]
      if(validFood(food)){
        food.draw()
        didCollide(food)
        }
      }
    }

  function validFood(food){
    return typeof food != "undefined"
  }

  function didCollide(food){
    if(validFood(food) && hit(food, snake.head)){
      snake.eat()
      removeFromFoods(food)
    }
  }

  function removeFromFoods(food){
    foods = foods.filter(function(f){
      return f != food
    })
  }

  function snakeHit(a,b){
    return a.x == b.x && b.y == a.y;
  }

  function hit(a,b){
    var hit = false;
    //Horizontal collisions
    if(b.x + b.width >= a.x && b.x <a.x + a.width){
      //Vertical collisions
      if(b.y + b.height >= a.y && b.y < a.y + a.height)
        hit = true;
    }
    //Collision a with b
    if(b.x <= a.x && b.x + b.width >= a.x + a.width)
    {
      if(b.y <= a.y && b.y + b.height >= a.y + a.height)
        hit = true;
    }

    //Collision b with a
    if(a.x <= b.x && a.x + a.width >= b.x + b.width){
      if(a.y <= b.y && a.y + a.height >= b.y + b.height)
        hit = true;
    }
    return hit;
  }

})()
