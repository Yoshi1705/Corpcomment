

const textareaEl = document.querySelector('.form__textarea');
const edit = document.querySelector('.counter');

const form =  document.querySelector('form');

const list = document.querySelector('.feedbacks');

const submit = document.querySelector('.submit-btn');

const spinner = document.querySelector('.spinner');

const url = 'https://bytegrad.com/course-assets/js/1/api/feedbacks';

const MAX = 150;

const hash = document.querySelector('.hashtags');

textareaEl.addEventListener('input',() =>{

     const max = MAX;

     const len = textareaEl.value.length;

     const rem = max - len;

      edit.textContent = rem;

})

const formdata = (input) =>{



    form.classList.add(input);
    setTimeout(() => {
     form.classList.remove(input);

    },2000);

}

const feedbackdetails = (f) =>{
    const feedbackel = `<li class="feedback">
    <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${f.upvoteCount}</span>
    </button>
    <section class="feedback__badge">
        <p class="feedback__letter">${f.badgeLetter}</p>
    </section>
    <div class="feedback__content">
        <p class="feedback__company">${f.company}</p>
        <p class="feedback__text">${f.text}</p>
    </div>
    <p class="feedback__date">${f.daysAgo === 0 ? 'NEW' : `${f.daysAgo}d`}</p>
</li>
`;

 list.insertAdjacentHTML('beforeend',feedbackel);
}

form.addEventListener('submit',(e)=>{
 
      e.preventDefault();
      const text = textareaEl.value;

      if(text.includes('#') && text.length > 5)
      {
           formdata('form--valid');
      }
      else
      {
            formdata('form--invalid');
           textareaEl.focus();
           return;
      }
      const company = text.split().find(word => word.includes('#')).substring(1);
      const badgeLetter = company.substring(0,1).toUpperCase();
      const upvoteCount = 0;
      const daysAgo = 0;
      
      const k = {
        company : company,
        upvoteCount : upvoteCount,
        text : text,
        badgeLetter : badgeLetter,
        daysAgo : daysAgo
      }
      
        feedbackdetails(k);
       
        //send data to server using post

        fetch(url,{
            method : 'POST',
            body : JSON.stringify(k),
            headers :{
                Accept : 'application/json',
                'Content-Type' : 'application/json'
            }
        }).then((res) =>{
            if(!res.ok)
            {
                console.log('there is error');
                return;
            }
            console.log('submitted successfully');
            
        }).catch(error =>{
            console.log(error.message);
        })

   textareaEl.value = '';
   submit.blur();
   edit.textContent = MAX;

       
})

list.addEventListener('click',(e)=>{
    const userintention = e.target;

    if(userintention.className.includes('upvote'))
    {
        const btnel =  userintention.closest('.upvote');
        btnel.disabled = true;

        const countel = btnel.querySelector('.upvote__count');

     let upVotecounter = +countel.textContent;

        upVotecounter = upVotecounter + 1;

        countel.textContent = upVotecounter;
    }
    else
    {
        userintention.closest('.feedback').classList.add('feedback-expand');
    }
})
//fetch data from server

fetch(url).then((res) =>{
  return res.json();
}).then((data) =>{
     spinner.remove();
        data.feedbacks.forEach(element => {

           feedbackdetails(element);
            
        });
}).catch((e) =>{
    feedbackel.textContent = `failed to fetch ${e.message}`;
})


hash.addEventListener('click',(e) =>{
   if(e.target.className === 'hashtags')
   {
      return;
   }
   
    const hashtagelement = e.target.textContent.substring(1).toLowerCase().trim();

      list.childNodes.forEach((ele) =>{
           if(ele.nodeType === 3)
           {
              return;
           }
           const comp = ele.querySelector('.feedback__company').textContent.toLowerCase().trim();

           if(hashtagelement !== comp)
           {
              ele.remove();
           }

      })
   
})