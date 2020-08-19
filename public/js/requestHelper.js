//URLS
var SEARCH = 'https://api.themoviedb.org/3/search/multi';
var DISCOVER = 'https://api.themoviedb.org/3/discover/';
var VIDEO = `https://www.googleapis.com/youtube/v3/search`;
function DETAILS(type,id){
  return `https://api.themoviedb.org/3/${type}/${id}`;
}
function IMAGE(id,type,size){
  if(!size){
    size = app[type+'_Size'];
  }
  return path = id ? {"SD": `https://image.tmdb.org/t/p/w92/${id}`, "HD": `https://image.tmdb.org/t/p/${size}/${id}`} : false;
}
function SIMILAR(movie_id,type){
  return `https://api.themoviedb.org/3/${type}/${movie_id}/similar`
}
function REVIEW(movie_id,type){
  return `https://api.themoviedb.org/3/${type}/${movie_id}/reviews`
}
var HISTORY;

function MDBReq(baseURL, successMethod, filters, scrollTop = true, extraData){
  filters = {...filters, ...{'api_key': configs['MDB_API_KEY']}}
  HISTORY = {
    baseURL : baseURL,
    successMethod : successMethod,
    filters : filters,
    extraData: extraData
  }
  SendReq(baseURL, {'success':successMethod}, filters, extraData);
  if(scrollTop){
    window.scrollTo(0, 0);
  }
}


function SendReq(baseURL, methods, filters,extraData){
  let query = $.ajax({
    url: baseURL,
    type: 'GET',
    data: {
      ...filters
    },
    success: function(response){
      methods['success'](response,extraData);
      LazyLoadImg.update();
    },
    error: function(response){
      if(methods['fail']){
        methods['fail'](response)
      }
    },
  })
}

function PostReq(baseURL, methods, data, headers){
    $.ajax({
      url: baseURL,
      type: 'POST',
      data: data,
      headers: {
        ...headers
      },
      success: function(response){
        methods['success'](response);
      },
      error: function(response){
        if(methods['fail']){
          methods['fail']
        }
      },
    })
  }

const postPC = (baseURL, methods, data)=>{PostReq(baseURL, methods, data,{auth:app.preferences.account.token})};


function getDate(dateOffset = 0){
  var date  = new Date
  date.setDate(date.getDate()+dateOffset);
  var month = date.getMonth()+1;
  var day = date.getDate().toString().length ==1 ? '0'+date.getDate() : date.getDate();
  month = month.toString().length == 1 ? '0'+ month : month;
  var fullDate =`${date.getFullYear()}-${month}-${day}`
  return fullDate
}
