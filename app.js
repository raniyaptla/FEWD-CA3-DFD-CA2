
document.getElementById('search').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
        searchMeals();
  }
});

function scrollToResult() {
  const resultContainer = document.getElementById('result-container');
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}


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

    axios
      .get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${x}`)
      .then((res) => {
        const listOfMeals = res.data.meals;

        listOfMeals.forEach((meal) => {
          const getMeal = document.createElement('div');
          getMeal.setAttribute('id', 'meal');
          getMeal.setAttribute('class', 'meal');

          // Pass the meal ID to the openMealDetailsPage function
          getMeal.addEventListener('click', () => openMealDetailsPage(meal.idMeal));

          const title = document.createElement('h3');
          const img = document.createElement('img');

          // Add a click event listener to the image
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

        // Update the previousSearch value
        previousSearch = x;

        // Reset apiCalled to allow the next API call
        apiCalled = false;

        // Scroll to the result section after the data is loaded
        scrollToResult();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // getResult.innerHTML = 'Error fetching data.';

        alert('Error fetching data. Please try again.');

        

        // Reset apiCalled and previousSearch in case of an error
        apiCalled = false;
        previousSearch = '';
      });
  }
}


function openMealDetailsPage(mealId) {
  // Redirect to a new webpage with the meal ID
  window.location.href = `meal.html?mealId=${mealId}`;
}




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

      // Store the meal details in a variable for later use
      window.currentMeal = meal;

      
    } else {
      // Hide the meal container if no meal is available
      mealContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching random meal:', error);
  }
}


function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';

  // Restore the webpage
  document.body.style.overflow = ''; // Enable scrolling
  document.getElementById('overlay').style.display = 'none';
}

// Function to open the modal with tabs
function openModal() {
  // Retrieve the stored meal details
  const meal = window.currentMeal;
  // Dim the rest of the webpage
  document.body.style.overflow = 'hidden'; // Prevent scrolling
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
// Add an event listener to the meal image to open the modal
document.getElementById('meal-image').addEventListener('click', openModal);

getRandomMeal();