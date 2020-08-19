var theRouter;
class Router {
  constructor(hash){
    this.hash = hash;

    window.addEventListener("hashchange", this.Hashchange.bind(this));
  }

  Close(){
    window.removeEventListener("hashchange",)
  }

  Hashchange(){
    if(this.hash != window.location.hash){
      this.hash = window.location.hash;
      this.LoadPage();
    }
  }

  Move(hash, title){
    hash = hash!=''?'#'+hash:hash;
    if(!title) title = hash;
    this.hash = hash;
    window.location.hash = hash;
  }

  LoadPage(event){
    this.hash = window.location.hash;
    let title;
    if(this.hash.includes('/')){
      let pathParts = this.hash.split('#')[1].split('/');
      let action = pathParts[0];
      let query = pathParts[1];
      let query2 = pathParts[2];
      title = this[action](query, query2);
    }
    else {
    //  app.home();
      title = 'Home';
    }
    document.title = title
  }

  Search(query){

    query = decodeURI(query);
    app.Action('Search', query);
    return "search: "+query;
  }

  Details(type,id){
    app.Action('GetDetailedPage',type,id)
    return 'MovieID:'+id;
  }

  Discover(type, query){
    app.Action('Discover',type, query)
    return query;
  }

  Genre(type,id){
    app.Action('SearchGenre', type,id);
    return 'Genre: '+app.getEl(`${id}_${type}_search`).innerText;
  }

  Home(){
    app.Home();
    return 'Home';
  }

}

window.onload = () => {
  app.SetImageSizes()
  let hash = window.location.hash;
  theRouter = new Router(hash);
  window.onpopstate = theRouter.LoadPage.bind(theRouter);
  if(hash){
    theRouter.LoadPage(hash.split('#')[1])
  }
}
