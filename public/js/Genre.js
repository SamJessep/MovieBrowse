class Genre{
  constructor(id, name,type){
      this.type = type;
      this.id = id;
      this.name = name;
  }

  makeLink(addToID){
    return `<a id='${this.id}_${this.type}_${addToID}' class='genreLink' href='#Genre/${this.type}/${this.id}'>${this.name}</a>`;
  }
}
