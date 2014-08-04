/**
 * Created by Travis on 8/4/14.
 */
$(document).ready(function(){
    $.ajax({
        url:'/leaderboard/',
        type: "GET",
        dataType: "html",
        success: function(response){
            console.log(response)
        },
        error: function(error){
            console.log(error)
        }


    })

});