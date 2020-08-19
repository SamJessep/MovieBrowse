class TVshow extends Result{
  constructor(data){
    super(data)
    this.type = 'tv'
    this.allData = data;
    this.id = data.id;
    this.title = data.name;
    this.about = data.overview;
    this.starRating = data.vote_average;
    this.rating;
    this.releaseDate = data.release_date || data.last_air_date;
    this.runTime = data.runtime;
    this.genres = data.genres || data.genre_ids;
    this.images = {
      poster: IMAGE(data.poster_path, 'poster'),
      backdrop: IMAGE(data.backdrop_path, 'still')
    }

  }

  makeDetailedPage(){
    if(!this.seasons){
      this.seasons = []
      this.getSeasons()
    }
  }

  loadDeatiledPage(){
    if(!this.runTime) this.runTime = this.allData.episode_run_time[0];
    this.trailer = new Trailer(this.allData)
    let backdrop = this.getPoster(this.images['backdrop'], 'detailsBackDrop');
    let trailer = this.getTrailer();
    let shortAbout = this.getShortAbout();
    let description = this.getDescripton();
    let downloadSection = this.getDownloadSection('Select an episode above');
    this.addReviews(null,'tv')
    this.addRelatedResults(null,'tv');
    let html = `
    <div class="detailedDiv" >
      <div id='BackdropDiv'>
        ${backdrop}
        ${trailer}
      </div>
      ${shortAbout}
      ${this.getSeasonSelector()}
      ${description}
      <details id="downloads" class="detailSection">
          <summary>Downloads</summary>
          <span id="torrentError" class="shown">Select an episode above for downloads</span>
      </details>
      <details class='detailSection' id='reviews'></details>
      <details class='detailSection' id='Recommendations' open></details>
    </div>
    `
    return html;
  }

  getObject(property,value,array){
    var result = array.find(obj => {
      return obj[property] === Number(value)
    })
    return result;
  }

  loadEpisode(){
    let sValue = app.getEl('season').value;
    let eValue = app.getEl('episode').value;
    let season = this.getObject('seasonNumber',sValue,this.seasons);
    let episode = this.getObject('episodeNumber',eValue,season.episodes);
    this.selectedEpisode = episode
    episode.updateDetailPage()
  }
  getSeasonSelector(){
    let seasonOptions = '';
    for(let aSeason of this.seasons){
      seasonOptions += `<option value=${aSeason.seasonNumber}>${aSeason.seasonNumber}</option>`
    }

    return `
    <div id='episodeArea'>
      <div id='SeasonSelect'>
        <label for='season'>Season:</label>
        <select id='season' onchange='app.loadedResult.getEpisodeSelector(this)'>
          <option selected disabled>Choose a season</option>
          ${seasonOptions}
        </select>
      </div>
      <div id='episodeSelect'></div>
    </div>
    `
  }
  getEpisodeSelector(s){
    this.selectedSeason = this.getObject('seasonNumber',s.value,this.seasons);
    let html,episodes = ''
    for(let aEpisode of this.selectedSeason.episodes){
        episodes += `<option value=${aEpisode.episodeNumber}>${aEpisode.episodeNumber}</option>`
    }
    html =  `
    <div id='episodeSelect'>
      <label for='episode'>Episode</label>
      <select id='episode' onchange='app.loadedResult.loadEpisode()'>
        <option selected disabled>Choose a episode</option>
        ${episodes}
      </select>
    </div>`
    app.Replace(app.getEl('episodeSelect'),html)
  }

  getSeasons(seasonData){
    if(seasonData){
      let s = []
      for(let aSeason of seasonData.seasons){
        s.push(new Season(aSeason.season_number, aSeason.episode_count, this.id,this))
      }
      this.seasons = s;
      app.Update(app.DetailPage,this.loadDeatiledPage())
    }
    else{
      let URL = `https://api.themoviedb.org/3/tv/${this.id}`
      MDBReq(URL,this.getSeasons.bind(this),{},false)
    }
  }
}
