class Review {
    constructor(ReviewData){
      this.id = ReviewData.id;
      this.content = ReviewData.content;
      this.author = ReviewData.author;
    }
    formatReview(){
      return `
      <div>
        <strong>${this.author}</strong>
        <p>${this.formatContent()}</p>
      </div>
      `
    }

    formatContent(){
      let shown, hidden;
        if (this.content.length > 250){
          shown = this.content.substring(0, 300);
          hidden = this.content.substring(300, this.content.length);
          return `<span id='comment_${this.id}'>"${shown}<a class='shown inline showBtn' href='#comment_${this.id}' onclick='Review.toggleShowComment(this);'>show more</a><span class='hidden inline'>${hidden}"</span></span>
                  `
        }
        else{
          return this.content
        }
    }
    static toggleShowComment(el){
      event.preventDefault();
      let hiddenText;
      if(el.nextSibling != null){
        if(el.nextSibling.classList.contains('hidden')){
          hiddenText = el.nextSibling;
          el.parentNode.insertBefore(el, el.nextSibling.nextSibling);
          el.innerText = "show less"
        }
      }else{
        hiddenText = el.previousSibling;
        el.parentNode.insertBefore(el, el.previousSibling);
        el.innerText = "show more"
      }

      hiddenText.classList.toggle('hidden');
      hiddenText.classList.toggle('shown');
    }
}
