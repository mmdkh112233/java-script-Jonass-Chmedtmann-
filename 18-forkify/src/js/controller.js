import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultView from './views/resultView.js';
import Pagination from './views/paginationView.js';
import BookmarkView from './views/bookmarkView.js';
import AddRecipeView from './views/addResipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime/runtime';


if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  
  try {
  const id = window.location.hash.slice(1)
  if(!id) return;

    //loading recipe
    recipeView.renderSpinner();

    ResultView.update(model.searchResultPage(1))

    BookmarkView.update(model.state.bookmark)

    await model.loadRecipe(id)
   
    //rendering recipe 
    recipeView.render(model.state.recipe);    
  } catch (error) {
      recipeView.renderError()
  }
}

const controlSearchResult = async function () {
  try {

    ResultView.renderSpinner()

    const query = SearchView.getQuery()
    if (!query) return;

    await model.loadSearchResult(query);

    ResultView.render(model.searchResultPage(1));

    ///render pagnation
    Pagination.render(model.state.search)

    
  } catch (error) {
    recipeView.renderError()
  }
}

const controlPagination = function (goto) {

  ResultView.render(model.searchResultPage(goto));

    ///render pagnation
    Pagination.render(model.state.search)
}


const controlServing = function (newServing) {
  model.updateServing(newServing)
  // recipeView.render(model.state.recipe);   
  recipeView.update(model.state.recipe);   
}

const controlAddBookmark = function () {
  // console.log(model.state.recipe.Bookmarked);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.removeBookmark(model.state.recipe.id)
  recipeView.update(model.state.recipe)

  BookmarkView.render(model.state.bookmark)
}

const controlBookmark = function() {
  BookmarkView.render(model.state.bookmark)
}

const controlAddRecipe = async function (newRecipe) {
 try {
   AddRecipeView.renderSpinner()
   
  await model.addRecipe(newRecipe)

  recipeView.render(model.state.recipe)
  AddRecipeView.renderMessage()
  BookmarkView.render(model.state.bookmark)

  window.history.pushState(null , '' , `#${model.state.recipe.id}`)

  setTimeout(AddRecipeView.toggleWindow(),4000)
 } catch (err) {

   AddRecipeView.renderError(err.message)
 }
}

const init = function () {
  BookmarkView.addHandelerRender(controlBookmark)
  recipeView.addHandelerRender(controlRecipe);
  recipeView.addHandelerUpdateRecipe(controlServing);
  recipeView.addHandelerBookmark(controlAddBookmark);
  SearchView.addHandelerSearch(controlSearchResult)
  Pagination.addHandlerPagination(controlPagination);
  AddRecipeView._addHandelerUpload(controlAddRecipe)
}

init();