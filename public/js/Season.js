class Season {
  constructor(seasonNumber, episodeCount, showID, show) {
      this.show = show;
      this.showID = showID;
      this.seasonNumber = seasonNumber;
      this.episodeCount = episodeCount;
      this.episodes = [];

      this.getEpisodes()
  }
  getEpisodes(){
    let URL = `https://api.themoviedb.org/3/tv/${this.showID}/season/${this.seasonNumber}`
    MDBReq(URL,this.saveEpisodes.bind(this),{},false);
  }

  saveEpisodes(data){
    for(let aEpisode of data.episodes){
        this.episodes.push(new Episode(aEpisode,this));
    }
  }
}
