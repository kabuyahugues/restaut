////// classs //////

class ApiConnect {
  constructor(baseUrl = 'https://www.themealdb.com/api/json/v1/1/',category) {
    this.baseUrl = baseUrl;
    this.categorie = category
  }

  // 🔄 Méthode générique
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur API :", error);
      return null;
    }
  }

  async getCategories() {
    const data = await this.fetchData('categories.php');
    return data;
  }

  async getMealsByCategory() {
    const data = await this.fetchData(`filter.php?c=${this.categorie}`);
    return data;
  }

  async getMealsById() {
    const data = await this.fetchData(`lookup.php?i=${this.categorie}`);
    return data;
  }

  setCategories(category){
    this.categorie = category
  }
}

///// variable ///////

let lien = new ApiConnect();


var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
});


////// function ///////

async function getUrl(element) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get(element);

  if (!slug) return;
  lien.setCategories(slug);
  if (element === 'categorie') {
    const dataSingleCategory = await lien.getMealsByCategory();
    return dataSingleCategory;
  }

  const dataSingleId = await lien.getMealsById();
  return dataSingleId;

}

async function showTheCategories(){

  const dataCatgories = await lien.getCategories();
  let divCategories = document.querySelector('.swiper-wrapper');

  if (divCategories) {
    divCategories.innerHTML = '';

    for (const element of dataCatgories.categories) {
      // console.log(element);
      let a = document.createElement('a')
      let h3 = document.createElement('h3');
      let img = document.createElement('img');

      a.classList.add('card', 'swiper-slide')
      h3.classList.add('title-categories')
      img.classList.add('img', 'img-categories')

      a.href = `categorie.html?categorie=${element.strCategory}`;
      h3.textContent = element.strCategory;
      img.src = element.strCategoryThumb;

      divCategories.appendChild(a)
      a.append(h3, img)
    }
  }

}

function showTheCat(data, num , numfin) {
  let divCategories = document.querySelector('.main-categorie');
  if(!divCategories) return;
  divCategories.innerHTML = '';

  const meals = data.meals.slice(num, numfin);

  for (const element of meals) {
    // console.log(element);
    let a = document.createElement('a')
    let h3 = document.createElement('h3');
    let img = document.createElement('img');

    a.classList.add('card', 'col3')
    h3.classList.add('title-categorie')
    img.classList.add('img', 'img-categories')

    a.href = `single.html?id=${element.idMeal}`;
    h3.textContent = element.strMeal;
    img.src = element.strMealThumb;

    divCategories.appendChild(a)
    a.append(h3, img)
  }
}

async function pagination(){
  let dataSingleCategory = await getUrl('categorie');  
  
  let btnNext = document.querySelector('.next')
  let btnPre = document.querySelector('.prec')

  let indexDebut = 0;
  let indexFin = 8;

  if (btnNext) {
    btnNext.addEventListener('click', (e) =>{
      indexDebut += 8
      indexFin += 8
      showTheCat(dataSingleCategory, indexDebut, indexFin)
    })
  }

  if (btnPre) {
    btnPre.addEventListener('click', (e) =>{
      indexDebut -= 8
      indexFin -= 8
      showTheCat(dataSingleCategory, indexDebut < 0 ? 0 : indexDebut, indexFin < 8 ? 8 : indexFin)
    })
  }
}

async function ShowAllSingleCategorie() {

  let dataSingleCategory = await getUrl('categorie');  

  let indexDebut = 0;
  let indexFin = 8;

  showTheCat(dataSingleCategory, indexDebut, indexFin);
}

async function searchTheMille() {
  const data = await getUrl('categorie');
  
  if (!data) return; 

  let inputMeal = document.querySelector('.mealSearch');
  let inputValue = inputMeal.value.trim().toLowerCase();
  
  const meals = data.meals.filter(element =>
    Object.values(element).some(value =>
      String(value).toLowerCase().includes(inputValue)
    )
  );
  

  if (inputValue) {
  let divCategories = document.querySelector('.main-categorie');

  divCategories.innerHTML = '';

  for (const element of meals) {
    console.log(element);
    
    // console.log(element);
    let a = document.createElement('a')
    let h3 = document.createElement('h3');
    let img = document.createElement('img');

    a.classList.add('card', 'col3')
    h3.classList.add('title-categorie')
    img.classList.add('img', 'img-categories')

    a.href = `single.html?id=${element.idMeal}`;
    h3.textContent = element.strMeal;
    img.src = element.strMealThumb;

    divCategories.appendChild(a)
    a.append(h3, img)
  }

  }
  
}
async function showSingleMiel() {
  const datas = await getUrl('id')
  const data = datas.meals[0];
  console.log(data);
  
  
  const main = document.querySelector('.main-single');

  main.innerHTML = '';

  const title = document.createElement('h1');
  title.textContent = data.strMeal;
  title.classList.add('recipe-title');

  const img = document.createElement('img');
  img.src = data.strMealThumb;
  img.alt = data.strMeal;
  img.classList.add('recipe-image');

  const meta = document.createElement('p');
  meta.textContent = `${data.strCategory} - ${data.strArea}`;
  meta.classList.add('recipe-meta');

  const tags = data.strTags ? data.strTags.split(',').map(tag => `#${tag}`).join(' ') : null;
  const tagEl = document.createElement('p');
  tagEl.textContent = tags || '';
  tagEl.classList.add('recipe-tags');

  const ingredientsList = document.createElement('ul');
  ingredientsList.classList.add('recipe-ingredients');

  for (let i = 1; i <= 20; i++) {
    const ingredient = data[`strIngredient${i}`];
    const measure = data[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      const li = document.createElement('li');
      li.textContent = `${measure || ''} ${ingredient}`.trim();
      ingredientsList.appendChild(li);
    }
  }

  const instructions = document.createElement('p');
  instructions.textContent = data.strInstructions;
  instructions.classList.add('recipe-instructions');

  let youtubeLink = null;
  if (data.strYoutube) {
    youtubeLink = document.createElement('a');
    youtubeLink.href = data.strYoutube;
    youtubeLink.textContent = 'Voir la vidéo sur YouTube';
    youtubeLink.classList.add('recipe-video');
  }

  let sourceLink = null;
  if (data.strSource) {
    sourceLink = document.createElement('a');
    sourceLink.href = data.strSource;
    sourceLink.textContent = 'Source originale';
    sourceLink.classList.add('recipe-source');
  }

  // Append tout dans le main
  main.append(
    title,
    img,
    meta,
    tagEl,
    ingredientsList,
    instructions,
    youtubeLink,
    sourceLink
  );
}


///// event ///////
document.addEventListener('DOMContentLoaded', () =>{
  let btnSearch = document.querySelector('.search');

  if (btnSearch) {
  btnSearch.addEventListener('click', (e) =>{

    searchTheMille()
    
  })

}
})



//// function affiché ////

showTheCategories();
ShowAllSingleCategorie();
pagination();
showSingleMiel();
