const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

var btnCreate = document.getElementById('btnCreate')
var btnRead = document.getElementById('btnRead')
var btnUpdate = document.getElementById('btnUpdate')
var btnDelete = document.getElementById('btnDelete')
var mealType = document.getElementById('mealType')
var recipeName = document.getElementById('recipeName')
var recipeContents = document.getElementById('recipeContents')

let pathName = path.join(__dirname, 'Files')

btnCreate.addEventListener('click', function(){ 
    let mealTypeValue = mealType.value
    let recipeNameValue = recipeName.value
    let weekValue = document.getElementById('Week').value
    let dayValue = document.getElementById('Day').value
    let timeValue = document.getElementById('Time').value


    let file = path.join(pathName,recipeNameValue + '.txt')
    
    // Fetch meal data based on mealType
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealTypeValue}`)
    .then(response => response.json())
    .then(data => {
        const mealData = data.meals[0]
        
        // Extract ingredients and YouTube link from the API response
        let ingredients = []
        for (let i = 1; i <= 20; i++) {
            var ingredient = mealData['strIngredient' + i]
            var measure = mealData['strMeasure' + i]
            if (ingredient && measure) {
                ingredients.push(`${measure} ${ingredient}`)
            }
        }

        let youtubeLink = mealData.strYoutube

        let contents = `Week: ${weekValue}\nDay: ${dayValue}\nTime: ${timeValue}\nMeal Name: ${mealData.strMeal}\nIngredients: ${ingredients.join('\n')}\nInstructions: ${mealData.strInstructions}\nYouTube Link: ${youtubeLink}`

        fs.writeFile(file, contents, function(err){ 
            if(err){
                return console.log(err)
            }
            var txtfile = recipeNameValue
            alert(txtfile + " recipe file was created")
            console.log("The file was created")
        })
    })
    .catch(error => {
        console.error('Error get meal data:', error)
        alert('Error get meal data. Please try again.')
    });
});

btnRead.addEventListener('click', function(){ 
    let recipeNameValue = recipeName.value
    let file = path.join(pathName, recipeNameValue + '.txt')

    fs.readFile(file, 'utf8', function(err, data){ 
        if(err){
            return console.log(err);
        }

        let contents = data
        recipeContents.value = contents

        console.log("File contents:", data)
    })
})
btnDelete.addEventListener('click', function(){ 
    let recipeNameValue = recipeName.value
    let file = path.join(pathName, recipeNameValue + '.txt')

    fs.unlink(file, function(err){ 
        if(err){
            return console.log(err)
        }
        recipeName.value = ""
        recipeContents.value = ""
        console.log("The file was deleted!")
        alert(recipeNameValue + " recipe file was deleted") 
    })
})

btnUpdate.addEventListener('click', function(){ 
    let file = path.join(pathName, recipeName.value + '.txt')

    let contents = recipeContents.value 

    fs.writeFile(file, contents, function(err){ 
        if(err){
            return console.log(err)
        }
        var txtfile = document.getElementById("recipeName").value
        alert(txtfile + " recipe file was updated")
        console.log("The file was updated!")
        recipeName.value = ""
        recipeContents.value = ""
    })
})





