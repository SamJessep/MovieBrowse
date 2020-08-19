let SearchTemplate = `
<summary>Advanced Search</summary>
<form id="advancedSearch">
  <div class='advancedSearchItem'>
    <label for='release_date.gte_select'>Year: From </label>
    <select name='release_date.gte' id='release_date.gte_select'>
      ${makeKeyedOptions(makeYearArray(), 'Select a year')}
    </select>
    <label for='release_date.lte_select'> To </label>
    <select name='release_date.lte' id='release_date.lte_select'>
      ${makeKeyedOptions(makeYearArray(), 'Select a year')}
    </select>
  </div>

  <div class='advancedSearchItem'>
    <label for='vote_average.gte_select'>Rating greater than:</label>
    <select name="vote_average.gte" id='vote_average.gte_select'>
      ${makeOptions(makeRatingArray(), 'Select a rating')}
    </select>
  </div>

  <div class='advancedSearchItem'>
    <label for='with_genres_select'>Genre</label>
    <select name='with_genres' id='with_genres_select'>
      ${makeKeyedOptions([], 'Select a genre')}
    </select>
  </div>

  <div class='advancedSearchItem'>
    <label for='mediaType'>Media type: </label>
    <select id='mediaType'>
      <option value="movie">Movie</option>
      <option value="tv">TV</option>
    </select>
  </div>

  <input type='submit' value="Apply"></input>
</form>
`
$('#advancedSearchSection').html(SearchTemplate);
$("#mediaType").change(function(){
    updateGenereList();
})

function setAdvancedSearchValues(options, type){
  $('#mediaType').val(type)
  for(let option in options){
    if(document.getElementById(`${option}_select`)){
      document.getElementById(`${option}_select`).value = options[option];
    }
  }
}

let form = document.getElementById("advancedSearch")
form.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();
    advancedSearch();
  })

function updateGenereList(){
  $("#with_genres_select").html(makeKeyedOptions(app.genres[$("#mediaType :selected").val()], "Select a genre"));
}

function makeOptions(options, defaultVal){
  let html = `<option selected value="None">${defaultVal}</option>`;
  options.forEach(option => {
      html += `<option value="${option}">${option}</option>`;
  });
  return html;
}

function makeKeyedOptions(options, defaultVal){
  let html = `<option selected value="None">${defaultVal}</option>`;
  options.forEach(option => {
      html += `<option value="${option.value}">${option.name}</option>`;
  });
  return html;
}

function makeYearArray(){
  years = []
  for(let i = new Date().getFullYear(); i>=1878; i--){
    years.push({value:i + "-01-01", name:i});
  }
  return years;
}

function makeRatingArray(){
  rating = []
  for(let i = 1; i<=10; i++){
      rating.push(i);
  }
  return rating;
}


function advancedSearch(){
  let filters = $("#advancedSearch").serializeArray();
  advParams = {}
  for(filter of filters){
    if(filter['value'] != "None"){
      advParams = {
        [filter.name] : filter.value,
        ...advParams
      }
    }
  }

  let params = {
    ...advParams
  }
  app.SearchBar.value = '';
  theRouter.Move(`Discover/${$("#mediaType :selected").val()}/Custom?${$.param(params)}`);
}
