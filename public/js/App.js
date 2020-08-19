class App{
  constructor(preferences){
    this.page = 1;
    this.totalPages = 0;
    this.preferences = preferences;
    this.loadedResult;

    this.discoverParams = {
      "Theatres":{
        'with_release_type' : '2|3',
        'release_date.gte' : getDate(),
        'release_date.lte' : getDate(30)
      },
      "Popular" : {
        'sort_by' : 'popularity.desc'
      },
      "Latest" : {
        'release_date.lte' : getDate(),
        'sort_by' : 'release_date.desc'
      },
      "Old" : {
        'sort_by' : 'release_date.asc'
      }
    }
    //Saved elements
    this.SearchArea = this.getEl('searchResults');
    this.SearchBar = this.getEl('search');
    this.DetailPage = this.getEl('details');
    this.PreferencesMenu = this.getEl('preferencesMenu');

    this.genres = {
                    'tv':[],
                    'movie': []
                  };


    //PC LINK
    this.PC_URL = '';
    this.tryGetPCURL()
    //Fetch UI data
    this.GetGenres();
  }

  tryGetPCURL(){
    SendReq("https://mdbscrap.herokuapp.com/DownloadToPcConfig.php", {'success':this.setPCURL.bind(this)}, {})
  }

  setPCURL(response){
    this.PC_URL = response['PC_URL'] ? response['PC_URL'] : ''
    if (app.getEl('downloadToPC')) app.getEl('downloadToPC').hidden = !this.PC_URL
  }
//---Basic-Utilities/Helper-Functions-------------------------------------------

  Update(el, content){
    if (el){
      el.innerHTML = content;
    }
  }

  Replace(el,content){
    if(el){
      el.outerHTML = content
    }
  }

  Append(el, content){
    el.insertAdjacentHTML('beforeend', content);
  }

  Prepend(el, content){
    el.insertAdjacentHTML('afterbegin', content);
  }

  Clear(){
    CloseMenu()
    this.getEl("advancedSearch").reset()
    this.page = 1;
    this.hide(this.PreferencesMenu)
    this.Empty(this.SearchArea)
    this.Empty(this.DetailPage)
    this.Empty(app.getEl('suggestedResults'))
  }

  Empty(el){
    el.innerHTML = '';
  }

  Scroll(x,y){
    window.scroll({
        top:x,
        bottom:y,
        behavior: 'smooth'
      })
  }

  getEl(id){
    return document.getElementById(id);
  }

  showMessage(msg){
    this.Update(this.SearchArea, msg);
  }

  setVisability(el,visable){
    el.classList[visable?'add':'remove']('shown');
    el.classList[visable?'remove':'add']('hidden');
  }

  setLoading(el, loading){
    el.classList[loading?'add':'remove']('loading');
  }

  hide(el){this.setVisability(el,false)}
  show(el){this.setVisability(el, true)}

  close(el){el.removeAttribute("open")};

  scrollIsNearBottom(){
    return $(window).scrollTop() + $(window).height() > $(document).height() - 400 && !$('searchBody').hidden;
  }

  isInViewport(elem){
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  isOnBottom(){
    return ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight);
  }

  SetImageSizes(){
    let h = window.innerHeight;
    let w = window.innerWidth;
    for(let aSizeSection in configs.imageSizes){
      let sizes = configs.imageSizes[aSizeSection];
      for(let aSize of sizes){
        aSize['leftOverWidth'] = Math.max(aSize.w,w) - Math.min(aSize.w,w);
      }
      sizes = sizes.sort(this.SortSizes)
      this[sizes[0].type+'_Size'] = sizes[0].leftOverWidth<400 ? sizes[0]['querySize'] : 'original';
      }
    }

    SortSizes(a, b){
       if (a['leftOverWidth'] < b['leftOverWidth']) return -1;
       if (a['leftOverWidth'] > b['leftOverWidth']) return 1;
       return 0;
    }
//---User-Actions---------------------------------------------------------------
Action(method,...params){
  this.Clear()
  this.showSortOptions(method)
  if(method) this[method](...params);
}

showSortOptions(m){
  let shouldHaveSort = [
    'Discover',
    'SearchGenre'
  ]
  if(shouldHaveSort.includes(m)){
    if(!this.getEl('sortElement')) this.Prepend(this.getEl('searchBody'), this.AddSortSelect());

    this.updateSelectedSort();
  }else{
    if(this.getEl('sortElement')) this.getEl('sortElement').outerHTML = '';
  }
}
//HOME
home(){
  this.SearchBar.value = '';
  this.showSortOptions('home')
  theRouter.Move('Home')
  this.Clear()
}

//SEARCH

Search(term){
  if(term.trim() != ''){
    MDBReq(SEARCH, this.LoadResults.bind(this), {
      'query' : term,
      'page' : 1,
      'language' : this.preferences.getLang(),
      'include_adult' : this.preferences.includeAdult,
      'region': app.preferences.country
    });
    this.page = 1;
  }
}

checkForSearch(ele) {
  if (event.key === 'Enter') {
    this.Clear();
    theRouter.Move('Search/'+ele.value)
  }
}
getAutoCompleteItems(ele){
  let term = ele.value
  if(term != ''){
    MDBReq(SEARCH, this.updateAutoComplete, {
      'query' : term,
      'page' : 1,
      'language' : this.preferences.getLang(),
      'include_adult' : this.preferences.includeAdult,
      'region': app.preferences.country
    },false)
  }
}
updateAutoComplete(data){
  let list = app.getEl('suggestedResults');
  let items ='';
  for(let aResult of data.results){
    items += `<option value='${aResult.title || aResult.name}'>`
  }
  app.Update(list, items);
}
//DISCOVER

Discover(type, hash){
  type = !type ? this.resultMediaType : type;
  let params;
  if(this.discoverParams.hasOwnProperty(hash)){
    params = this.discoverParams[hash];
  }else if(hash.includes('?') && hash.includes('Custom')){
    params = this.GetCustomParams(hash);
    setAdvancedSearchValues(params, type);
  }else{
    console.error("please provide a discover preset or custom");
    return;
  }
  MDBReq(DISCOVER+type, this.LoadResults.bind(this), {
    ...params,
    ...this.preferences.garbageFilters,
    'language' : this.preferences.getLang(),
    'include_adult' : this.preferences.includeAdult,
    'page' : this.page,
    'region': app.preferences.country,
    'append_to_response': 'media_type'
  },true,type)
}

GetCustomParams(params){
  return $.deparam(decodeURI(params.split('?')[1]));
}


LoadResults(data,type){
  let timer
  this.totalPages = data.total_pages;
  this.hide(this.DetailPage);
  this.page = data.page;
  if(data.results.length>0){
    if(data.results.length == 1 && data.results[0].media_type){
      theRouter.Move(`Details/${data.results[0].media_type}/${data.results[0].id}`)
    }else{
      this.Update(this.SearchArea, this.GetResultHTML(data.results,type));
    }
  }else{
    this.showMessage('No results found...')
  }
}

GetResultHTML(results,type){
  let html = '';
  let isMovie, isTV = 0;
  for(let aResult of results){
    if(type && !aResult.media_type){
      aResult.media_type = type;
    }
    if(aResult.media_type == 'tv'){
      html += new TVshow(aResult).makeCard();
      isTV = true;
    }else if(aResult.media_type == 'movie'){
      html += new Movie(aResult).makeCard();
      isMovie = true;
    }
  }
  if(isMovie && !isTV){
    app.resultMediaType = 'movie';
  }else if (!isMovie && isTV) {
    app.resultMediaType = 'tv';
  }else if (isMovie && isTV) {
    app.resultMediaType = 'both';
  }
  return html;
}

AddSortSelect(){
  let optionsHTML = '';
  for(let aOption of configs.sortOptions){
    optionsHTML += `<option id='SortIndex_${configs.sortOptions.indexOf(aOption)}'value='${aOption.value}'>${aOption.name}</option>`;
  }

  return `
  <label id='sortElement'>Sort by:
    <select id='sort_by_select' onchange='Result.sortResults(this)'>
      <option id='noSort' selected disabled>...</option>
      ${optionsHTML}
    </select>
  </label>
  `
}

updateSelectedSort(){
  if(window.location.hash.includes('?')){
    let query = $.deparam(window.location.hash.split('?')[1]);
    if(query.hasOwnProperty('sort_by')){
      let sortVal = query.sort_by
      let sortIndex = -1;
      for(let aSortType of configs.sortOptions){
        if(aSortType.value == sortVal){
          sortIndex = configs.sortOptions.indexOf(aSortType)
        }
      }
      this.getEl('SortIndex_'+sortIndex).selected = true;
    }

  }else{
    this.getEl('noSort').selected = true;
  }
}

scrollEvent(timer,milliseconds){
  if(timer) window.clearTimeout(timer);
  timer = window.setTimeout(function (){
    this.showScrollButton()
    if(this.scrollIsNearBottom()) this.loadMore();
  },milliseconds)
  return timer
}

loadMore(data){
  if(data){
    if(data.hasOwnProperty('results')){
      if(data.results.length>1){
        app.Append(this.SearchArea, this.GetResultHTML(data.results,'movie'));
      }
    }
  }else if (this.page<this.totalPages) {
    this.page++;
    let req = HISTORY;
    req.filters['page'] = this.page;
    MDBReq(req.baseURL, this.loadMore.bind(this), req.filters,false);
  }
}

showScrollButton(){
  let quickBar = app.getEl('quickBar');
  let scrollBtn = app.getEl('backToTop')
  this[app.isInViewport(quickBar)?'hide':'show'](scrollBtn);
}

//DETAILED

GetDetailedPage(type,id){
  MDBReq(DETAILS(type,id), this.LoadDetailedPage.bind(this), {'append_to_response': 'release_dates'},true, type)
}

LoadDetailedPage(data,type){
  let page;
  this.hide(this.SearchArea);
  if(type == 'tv'){
    this.loadedResult = page = new TVshow(data);
    page.makeDetailedPage()
  }else{
    this.loadedResult = page = new Movie(data);
    this.Update(this.DetailPage, page.makeDetailedPage())
  }
  this.loadedResult = page;
  this.show(this.DetailPage);
}

//GENRE SEARCH

SearchGenre(type,id){
  MDBReq(DISCOVER+type, this.LoadResults.bind(this), {
    ...this.preferences.garbageFilters,
    'language' : this.preferences.getLang(),
    'include_adult' : this.preferences.includeAdult,
    'release_date.lte' : getDate(),
    'page' : 1,
    'with_genres' : id,
    'region': app.preferences.country
  },true, type)
}

GetGenres(){
  var baseURL = 'https://api.themoviedb.org/3/genre/movie/list';
  MDBReq(baseURL, this.AddGenres.bind(this), {
    'language' : this.preferences.getLang()
  },false,'movie')
  baseURL = 'https://api.themoviedb.org/3/genre/tv/list';
  MDBReq(baseURL, this.AddGenres.bind(this), {
    'language' : this.preferences.getLang()
  },false,'tv')
}

AddGenres(data,type){
  let title = type == 'movie'?'Movie':'TV'
  let html, links = ''
  for(let aGenre of data.genres){
    this.genres[type].push({"name": aGenre.name, "value": aGenre.id});
    links += new Genre(aGenre.id, aGenre.name,type).makeLink('search');
  }
  updateGenereList();
  html = `
    <details>
      <summary>${title}</summary>
      ${links}
    </details>
  `
  this.Append(this.getEl('GenreSelect'), html);
}

}
