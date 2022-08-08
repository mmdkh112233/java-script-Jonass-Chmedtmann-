import { async } from "regenerator-runtime"
import { API_URL , Key } from "./config.js";
import { getJson , sendJson} from "./views/helper.js";

export const state = {
    recipe : {},
    search : {
        query : '',
        results : [],
        page : 1,
        resultPerPage : 10
    },
    bookmark: [],
}

const creatRecipeObject = function(data) {
  const {recipe} = data.data;
  return {
    id : recipe.id,
    title : recipe.title,
    publisher : recipe.publisher,
    sourceUrl : recipe.source_url,
    image : recipe.image_url,
    servings : recipe.servings,
    timeCooking : recipe.cooking_time,
    ingredients : recipe.ingredients,
    ...(recipe.key && {key : recipe.key})
  }

} 

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}?key=${Key}`)
   state.recipe = creatRecipeObject(data)
  
    if (state.bookmark.some(bookmark => bookmark.id ===id))
        state.recipe.bookmarked = true
        else state.recipe.bookmarked = false;
    
  } catch (error) {
    throw error;
  }
}



export const loadSearchResult = async function (query) {

  try {
    state.search.query = query;
    const data = await getJson(`${API_URL}?search=${query}&key=${Key}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id : rec.id,
        title : rec.title,
        publisher : rec.publisher,
        image : rec.image_url,
        ...(rec.key && {key : rec.key})
      }
    })
  } catch (error) {
    throw error;
  }

}


export const searchResultPage = function (page) {
  state.search.page = page;

  const start = (page - 1) * 10;
  const end = page * 10;

  return state.search.results.slice(start , end)
}

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings
  });

  state.recipe.servings = newServing;
}

const persistBookmark = function() {
  localStorage.setItem('bookmarks' , JSON.stringify(state.bookmark))
}

export const addBookmark = function (recipe) {
  //add to bookmark array
  state.bookmark.push(recipe);

  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark()
}

export const removeBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id)
  state.bookmark.splice(index , 1)
  if(id === state.recipe.id) state.recipe.bookmarked = false;
  
  persistBookmark()
}

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage)
}

init()

export const addRecipe = async function(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe).filter(
      entery => entery[0].startsWith('ingredient') && entery[1] !== '')
      .map(ing => {
  
        const ingArr =  ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('wrong format')
  
        const [quantity , unit , description] = ingArr;
      return{quantity : quantity ? +quantity : null , unit , description};
      });

      const recipe = {
        title : newRecipe.title,
        publisher : newRecipe.publisher,
        source_url : newRecipe.sourceUrl,
        image_url : newRecipe.image,
        servings : +newRecipe.servings,
        cooking_time : +newRecipe.cookingTime,
        ingredients,
      }
      
      const data = await sendJson(`${API_URL}?key=${Key}` , recipe)
      state.recipe = creatRecipeObject(data)
      addBookmark(state.recipe)
  } catch (err) {
    throw err
  }


}