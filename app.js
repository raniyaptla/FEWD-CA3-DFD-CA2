
//enter key if i press it should pass the value
document.getElementById('search').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
        searchMeals();
  }
});

//to scroll to the part of teh page where the results come

function scrollToResult() {
  const resultContainer = document.getElementById('result-container');
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

//getting the search input from the search button
var btn = document.getElementById('btn');

btn.onclick = searchMeals;
let arr = [];   
let apiCalled = false;  


var previousSearch = '';

function searchMeals() {
  // Reset the array and previous search at the beginning of the function
  arr = [];
  previousSearch = '';

  if (!apiCalled) {
    apiCalled = true;

    var x = document.getElementById('search').value.trim();

    const getResult = document.getElementById('result');
    //dynamically fetching from api

    axios
      .get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${x}`)
      .then((res) => {
        const listOfMeals = res.data.meals;

        listOfMeals.forEach((meal) => {
          const getMeal = document.createElement('div');
          getMeal.setAttribute('id', 'meal');
          getMeal.setAttribute('class', 'meal');

          
          getMeal.addEventListener('click', () => openMealDetailsPage(meal.idMeal));

          const title = document.createElement('h3');
          const img = document.createElement('img');
          //when i click on image it redirects to new page

          
          img.addEventListener('click', () => openMealDetailsPage(meal.idMeal));

          title.innerText = meal.strMeal;
          img.setAttribute('src', meal.strMealThumb);

          getMeal.append(img);
          getMeal.append(title);

          arr.push(getMeal);
        });

        getResult.innerHTML = '';
        arr.forEach((meal) => {
          getResult.append(meal);
        });

        
        previousSearch = x;

        
        apiCalled = false;

      
        scrollToResult();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        

        alert('Error fetching data. Please try again.');

        

        apiCalled = false;
        previousSearch = '';
      });
  }
}


function openMealDetailsPage(mealId) {
 
  window.location.href = `meal.html?mealId=${mealId}`;
}



//function to fetch random meal 
async function getRandomMeal() {
  const mealContainer = document.getElementById('meal-details');

  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();

    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      const mealName = meal.strMeal;
      const mealImage = meal.strMealThumb;

      
      const mealNameElement = document.getElementById('meal-name');
      const mealImageElement = document.getElementById('meal-image');
      mealNameElement.textContent = mealName;
      mealImageElement.src = mealImage;

      mealContainer.style.display = 'block';

      
      window.currentMeal = meal;

      
    } else {
    
      mealContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching random meal:', error);
  }
}

//function to close the modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';

  document.body.style.overflow = ''; 
  document.getElementById('overlay').style.display = 'none';
}
//funcction to open the modal and display the ingredients and instructions
function openModal() {

  const meal = window.currentMeal;
  
  document.body.style.overflow = 'hidden'; 
  document.getElementById('overlay').style.display = 'block';

  const modal = document.getElementById('modal');
  const ingredientsTab = document.getElementById('ingredients');
  const instructionsTab = document.getElementById('instructions');
  const mealTab = document.getElementById('meal');
  const ingredients = meal.strIngredient1 ? getIngredientsList(meal) : 'No ingredients available.';
  const instructions = meal.strInstructions || 'No instructions available.';
  const mealImage = meal.strMealThumb;
  

  modal.style.display = 'block';
  ingredientsTab.innerHTML = ingredients;
  instructionsTab.innerHTML = instructions;
  

  mealTab.innerHTML = '';
  const mealImageElement = document.createElement('img');
  mealImageElement.id = 'meal-image1';
  mealImageElement.src = mealImage;
  mealTab.appendChild(mealImageElement);

  const mealNameElement = document.createElement('div');
  mealNameElement.id = 'meal-name1';
  mealNameElement.textContent = meal.strMeal;
  mealTab.appendChild(mealNameElement);

  mealTab.style.display = 'block';
  ingredientsTab.style.display = 'none';
  instructionsTab.style.display = 'none';


}

//adding differetn tabs to the modal

function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  const tabbuttons = document.getElementsByClassName('tab-button');
  for (let i = 0; i < tabbuttons.length; i++) {
    tabbuttons[i].className = tabbuttons[i].className.replace(' active', '');
  }
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}


//displaying the ingredients in list format
function getIngredientsList(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && measure) {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }
  return ingredients.length ? createList(ingredients) : 'No ingredients available.';
}
function createList(items) {
  const list = document.createElement('ul');
  items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = item;
    list.appendChild(listItem);
  });
  return list.outerHTML;
}

document.getElementById('meal-image').addEventListener('click', openModal);

getRandomMeal();
