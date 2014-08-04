$(document).ready(function () {
    $.ajax({
            url: '/get_score/',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                if (response.highscore.score__max === null){
                     $('.score').html("<h3>Recent high score: 0 </h3>")
                }
                else {
                    $('.score').html("<h3>Recent high score: " + response.highscore.score__max + "</h3>")
                }
            },
            error: function(error){
            }


        });
    // Let's set up some variables to save the canvas elements and properties
    var canvas = $("#canvas")[0];
    var canvasContext = canvas.getContext("2d");
    var width = $("#canvas").width();
    var height = $("#canvas").height();
    var speed;

    // Will represent each body cell of the snake
    var snakeBody;
    var gameLoopInterval;
    var cellWidth = 10;

    var currentDirection;
    var score;
    var highscore = 0;

    $('#play').on('click', startGame);


    function gameLoop() {
        var nextPosition = getNextPosition();

        if(checkGameOver(nextPosition, snakeBody)) {
            gameOver();
            return;
        }

//        // Remove the tail of the snake
//        snakeBody.pop();
//
//        // Add the next position
//        // to the front of our snakeBody
//        snakeBody.unshift(nextPosition);

//        getNextPosition();
//        checkGameOver();
        var ateFood = checkEatFood(nextPosition);
        if(!ateFood){
            //Remove the tail of the snake, only if we didn't eat food this time around
            snakeBody.pop()
        }

        // Add the next position to the front of our snakeBody
        snakeBody.unshift(nextPosition);

        paintCanvas();
    }


    // Get the next position of the snake
    function getNextPosition() {
        // First let's grab the snake's head's x and y
        var currentPosition = snakeBody[0];
        var nextPosition = {
            x: currentPosition.x,
            y: currentPosition.y
        };

        // Increment the x or y value depending on what
        // direction the snake is going
        if (currentDirection == "right") nextPosition.x++;
        else if (currentDirection == "left") nextPosition.x--;
        else if (currentDirection == "up") nextPosition.y--;
        else if (currentDirection == "down") nextPosition.y++;

        return nextPosition;
    }

    var food;

    // Create a random piece of food
    function createFood() {

        food = {
            x: Math.round(Math.random() * (width - cellWidth) / cellWidth),
            y: Math.round(Math.random() * (height - cellWidth) / cellWidth)

        }

    }



    // Check if snake has collided with walls or itself
    function checkGameOver(position, snakeBody) {
        if(position.x == -1 || position.x == width / cellWidth) {
            // If the snake has gone off the left or right boundaries, game over!
            return true;
        } else if(position.y == -1 || position.y == height / cellWidth) {
            // If the snake has gone off the top or bottom boundaries, game over!
            return true;
        } else {
            // If the snake's next position collides with another cell in it's body, game over!
            for (var i = 0; i < snakeBody.length; i++) {
                if (snakeBody[i].x == position.x && snakeBody[i].y == position.y) {
                    return true;

                }
            }
            return false;
        }
    }



    // Check if snake is on the same space as food
    function checkEatFood(position) {
        if (position.x == food.x && position.y == food.y){
            // The snake is eating the food
            // Create a new piece of food, which removes this current one
            createFood();
            score++;
            speed--;
            if (score > highscore) {
            highscore = score;

//            canvasContext.fillText("<p>Your high score: " + highscore + "<p>");
        }
            return true;
        }else{
            return false;
        }
    }



    // Paint the snake and food
    function paintCanvas() {
        // Lets fill in the canvas colors
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(0, 0, width, height);
        canvasContext.strokeStyle = "black";
        canvasContext.strokeRect(0, 0, width, height);

        // Paint the snake body
        for (var i = 0; i< snakeBody.length; i++){
            var cell = snakeBody[i];

            if (i == 0) {
                paintCell(cell.x, cell.y, "blue")
            }
            else{
                paintCell(cell.x, cell.y, "red");
            }
        }

        // Paint the food
//        var apple = "";
        paintCell(food.x, food.y, "green");

        var scoreText = "Score: " + score;
        var HighScoreText = "HighScore " + highscore;
        canvasContext.fillText(scoreText, 5, height - 5);


        canvasContext.fillText(HighScoreText, 5, height - 15 );

    }

    //Lets first create a generic function to paint cells
    function paintCell(x, y, color) {
        canvasContext.fillStyle =color;
        canvasContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
        canvasContext.strokeStyle = "white";
        canvasContext.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    }





    function createSnake(){
        // Starting length of the snake will be 5 cells
        var length = 5;

        // Let's set the snake body back to an empty array
        snakeBody = [];

        //Add cells to the snake body starting from the top left hand corner of the screen
        for (var i = length -1; i >= 0; i--){
            snakeBody.push({x: i, y: 0});
        }
    }
    $('#slow').on('click', function(){
        speed = 90;
    });
    $('#medium').on('click', function(){
        speed = 60;
    });
     $('#fast').on('click', function(){
        speed = 34;
    });
    function startGame(){
        // Create the initial snake
        createSnake();
        // Let's set the game loop to run every 60 milliseconds
        gameLoopInterval = setInterval(gameLoop, 60);

        // Default the snake going right
        currentDirection = "right";

        // Create the initial food
        createFood();
        createFood();
        score = 0;
    }

    // Let's set up the arrow keys for our game
    $(document).keydown(function (e) {
        var key = e.which;

        // This will change the direction of the snake
        // Make sure we check that the user isn't trying to have the snake go backwards
        if (key == "37" && currentDirection != "right") currentDirection = "left";
        else if (key == "38" && currentDirection != "down") currentDirection = "up";
        else if (key == "39" && currentDirection != "left") currentDirection = "right";
        else if (key == "40" && currentDirection != "up") currentDirection = "down";
    });

    function gameOver() {
        clearInterval(gameLoopInterval);
        canvasContext.fillText('Game Over', 150, 200);
        $('#play').text("Play Again");
        var gameInfo ={
            'game' :"snake", 'score': score
            };
        gameInfo = JSON.stringify(gameInfo);
        $.ajax({
            url: '/new_score/',
            type: 'POST',
            data: gameInfo,
            dataType: 'json',
            success: function(response){
                console.log(response);
            },
            error: function(error){
                console.log(error);
            }


        })




    }



});