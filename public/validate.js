function validate(){
    const shorturl = document.querySelector("#optn").value;
    for(let i = 0; i < urls.length; i++){
        if(urls[i].short == shorturl ){
            document.querySelector(".modal").style.display="block";
            return;
        } 
    }
    document.forms['shortener'].submit();
}