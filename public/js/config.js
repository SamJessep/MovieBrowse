var configs = {
  'MDB_API_KEY' : '579872d8976e8f07d27624584808fee2',
  'YT_API_KEY' : 'AIzaSyBwdzAW5hpb-jtIKH5upVA58f53KUcBkg0',
  'imageSizes':{
    'posterSizes': [],
    'backdropSizes': [],
    'stillSizes': []
  },
  'sortOptions': [
    {name: 'popularity &#9650;', value: 'popularity.asc'},
    {name: 'popularity &#9660;', value: 'popularity.desc'},
    {name: 'release date &#9650;', value: 'release_date.asc'},
    {name: 'release date &#9660;', value: 'release_date.desc'},
    {name: 'revenue &#9650;', value: 'revenue.asc'},
    {name: 'revenue &#9660;', value: 'revenue.desc'},
    {name: 'title &#9650;', value: 'original_title.asc'},
    {name: 'title &#9660;', value: 'original_title.desc'},
    {name: 'star rating &#9650;', value: 'vote_average.asc'},
    {name: 'star rating &#9660;', value: 'vote_average.desc'}
  ]
}
let i = {
  "backdrop_sizes": [
    "w780",
    "w1280",
    "original"
  ],
  "poster_sizes": [
    "w92",
    "w154",
    "w185",
    "w342",
    "w500",
    "w780",
    "original"
  ],
  "still_sizes": [
    "w92",
    "w185",
    "w300",
    "original"
  ]
}

function addSizes(type, location, sizes){
  for(let aSize of sizes){
    if(aSize != "original"){
      let key = Number(aSize.split('w')[1]);
      configs.imageSizes[location].push({'type':type,'w':key, querySize:aSize});
    }
  }
}

addSizes('poster','posterSizes', i.poster_sizes);
addSizes('backdrop', 'backdropSizes', i.backdrop_sizes);
addSizes('still', 'stillSizes', i.still_sizes);
