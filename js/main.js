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

async function showTheCategories(){

  const dataCatgories = await lien.getCategories();
  let divCategories = document.querySelector('.swiper-wrapper');

  if (divCategories) {
    divCategories.innerHTML = '';

    for (const element of dataCatgories.categories) {
      console.log(element);
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

  divCategories.innerHTML = '';

  const meals = data.meals.slice(num, numfin);

  for (const element of meals) {
    console.log(element);
    let a = document.createElement('a')
    let h3 = document.createElement('h3');
    let img = document.createElement('img');

    a.classList.add('card', 'col3')
    h3.classList.add('title-categorie')
    img.classList.add('img', 'img-categories')

    a.href = `categorie.html?categorie=${element.strMeal}`;
    h3.textContent = element.strMeal;
    img.src = element.strMealThumb;

    divCategories.appendChild(a)
    a.append(h3, img)
  }
}

async function pagination(){
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('categorie');

  if (!slug) return;
  lien.setCategories(slug);

  const dataSingleCategory = await lien.getMealsByCategory();
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
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('categorie');

  if (!slug) return;
  lien.setCategories(slug);

  const dataSingleCategory = await lien.getMealsByCategory();

  let indexDebut = 0;
  let indexFin = 8;

  showTheCat(dataSingleCategory, indexDebut, indexFin);
}

///// event ///////



//// function affiché ////

showTheCategories();
ShowAllSingleCategorie();
pagination();
