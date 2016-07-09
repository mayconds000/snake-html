;(function(){
  class Random{
    static get(inicio, final){
      return Math.floor(Math.random() * final) + inicio;
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
      return new Food(Random.get(0,499), Random.get(0,299))
    }
  }

  class Square{
    constructor(x, y){
      this.x = x
      this.y = y
      this.width = 10
      this.height = 10
      this.back = null
    }

    draw(){
      ctx.fillRect(this.x, this.y, this.width, this.height)
      if(this.hasBack()){
        this.back.draw()
      }
    }

    add(){
      if(this.hasBack()) return this.back.add()
      this.back = new Square(this.x, this.y)
      this.draw()
    }
    hasBack(){
      return this.back !== null
    }

    copy(){
      if(this.hasBack()){
        this.back.copy()
        this.back.x = this.x
        this.back.y = this.y
      }
    }

    right(){
      this.copy()
      this.x += 10
    }
    left(){
      this.copy()
      this.x -= 10
    }
    up(){
      this.copy()
      this.y -= 10
    }
    down(){
      this.copy()
      this.y += 10
    }

    hit(head, second=false){
      if(this === head && !this.hasBack()) return false
      if(this === head) return this.back.hit(head, true)

      if(segundo && !this.hasBack()) return false
      if(segundo)return this.back.hit(head)

      //Is not a head and not is the second
      if(this.hasBack()){
        return snakeHit(this, head) || this.back.hit(head)
      }

      //Is not a head and not is the second, but is the last
      return snakeHit(this, head)
    }

  }

  class Snake{
    constructor(){
      this.head = new Square(100, 0)
      this.draw()
      this.direction = "right"
      this.head.add()
      this.head.add()
      this.head.add()
    }

    draw(){
      this.head.draw()
    }

    right(){
      this.direction = "right"
    }
    left(){
      this.direction = "left"
    }
    up(){
      this.direction = "up"
    }
    down(){
      this.direction = "down"
    }

    move(){
      if(this.direction === "up") return this.head.up()
      if(this.direction === "down") return this.head.down()
      if(this.direction === "right") return this.head.right()
      if(this.direction === "left") return this.head.left()
    }

    eat(){
      this.head.add()
    }

    dead(){
      return this.head.hit(this.head)
    }
  }

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  const snake = new Snake()
  let foods = []

  window.addEventListener("keydown", function(event){
  event.defaultPrevented()
    if(event.keyCode === 40) return snake.down();
    if(event.keyCode === 39) return snake.right();
    if(event.keyCode === 38) return snake.up();
    if(event.keyCode === 37) return snake.left();

    return false;
  })

  setInterval(function(){
    snake.move()
    ctx.clearRect(0,0,canvas.width, canvas.height)
    snake.draw()
    drawFood()
  }, 1000 / 5)

  setInterval(function(){
    let food = Food.generate()
    foods.push(food)

    setTimeout(function(){
      //Elimina a comida
      removeFromFoods(food)
    },10000)
  }, 4000)

  function drawFood() {
    for(let index in foods){
      const food = foods[index]

      if(typeof food !== "undefined"){
        food.draw()
        if(hit(food, snake.head)){
          snake.eat()
          removeFromFoods(food)
        }
      }
    }
  }

  function removeFromFoods(food){
    foods = foods.filter(function(f){
      return food !== f
    })
  }
})()
