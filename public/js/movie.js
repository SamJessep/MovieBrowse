class Movie extends Result{
  constructor(data) {
    super(data)
    this.id = data.id;
    this.title = data.title || data.name;
    this.about = data.overview;
    this.starRating = data.vote_average;
    this.rating;
    this.releaseDate = data.release_date;
    this.runTime = data.runtime;
    this.genres = data.genres || data.genre_ids;
    this.images = {
      poster: IMAGE(data.poster_path,'poster'),
      backdrop: IMAGE(data.backdrop_path,'backdrop')
    }

  }
}
