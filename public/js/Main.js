let savedPreferences = Preferences.fetchData();
let preferencesObject = new Preferences()
if(savedPreferences){
  Preferences.LoadData(preferencesObject,savedPreferences)
}
const app = new App(preferencesObject);

$('#search').on('input', function(){
  app.getAutoCompleteItems(this);
});

$("#preferencesForm").submit((e)=>{e.preventDefault()})
window.addEventListener("resize", app.SetImageSizes.bind(app));
window.addEventListener('scroll', throttle(infinateLoad, 500));
window.onscroll = function(ev) {
  app.showScrollButton()
  if(app.isOnBottom() && app.getEl('details').classList.contains('hidden')){
    app.loadMore();
  }
}
function infinateLoad(){
  if(app.scrollIsNearBottom() && app.getEl('details').classList.contains('hidden')){
    app.loadMore()
  }
}

const interval = setInterval(function() {
   app.tryGetPCURL()
 }, 60000);

//clearInterval(interval);
