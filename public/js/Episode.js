class Episode {
  constructor(data,season) {
    this.season = season
    this.id = data.id;
    this.episodeNumber = data.episode_number
    this.seasonNumber = data.season_number;
    this.title = data.name;
    this.about = data.overview;
    this.starRating = data.vote_average;
    this.releaseDate = data.air_date;
    this.images = {
      poster: season.show.images.poster,
      backdrop: IMAGE(data.still_path, 'w92')
    }
  }

  getTitle(){
    return `<h2 id='title'>${this.season.show.title} - ${this.title}</h2>`;
  }

  getDescripton(){
    return `<p id='description'>${this.about}</p>`
  }

  getReleaseDate(){
    return `<p id='release-date'>${this.releaseDate}</p>`
  }

  getRating(){
    return `<div class='ratings' id='rating' style='width:${(this.starRating/2)*5}vmin;'></div>`
  }

  updateDetailPage(){
    app.Replace(app.getEl('title'), this.getTitle());
    app.Replace(app.getEl('description'), this.getDescripton());
    app.Replace(app.getEl('release-date'), this.getReleaseDate());
    app.Replace(app.getEl('rating'), this.getRating());
    app.Replace(app.getEl('downloads'), this.season.show.getDownloadSection())
    Torrent.GetTorrents(true);
  }
}
