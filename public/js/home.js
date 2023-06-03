addEventListener("load", function() {
    let nextPage = "";
    let allowMoreResults = true;
    const instagramPosts = document.querySelector(".instagram_cards");

    function getMoreInstagramResults() {
        allowMoreResults = false;
        const request = new XMLHttpRequest(); 
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.responseText);
                if(response.next) {
                    nextPage = response.next;
                    allowMoreResults = true;
                }

                let newData = "";

                for(post of response.data) {
                    newData += `<a class="instagram_card" href="${post.permalink}" target="_blank" style="background-image: url('${(post.media_type == 'VIDEO') ? post.thumbnail_url : post.media_url}')">`;
                    if (post.media_type == "VIDEO") {
                        newData += `
                            <div class="video_icon">
                                <svg class="video_icon" width="64px" height="64px">
                                    <use xlink:href="/svg/play-fill.svg#id"/>
                                </svg>
                            </div>
                        `;
                    }
                    newData += `
                        <div class="overlay">
                            <span><svg width="20" height="20" style='margin-right: 6px'><use xlink:href="/svg/suit-heart-fill.svg#id"/></svg>${post.like_count}</span>
                            <span><svg width="20" height="20" style='margin-right: 6px'><use xlink:href="/svg/chat-fill.svg#id"/></svg>${post.comments_count}</span>
                        </div>
                    </a>
                    `;
                }

                console.log(newData);
                instagramPosts.innerHTML += newData;
            }
        }
        request.open("POST", '/.instagram?page=' + nextPage);
        request.send();
    }

    getMoreInstagramResults();

    addEventListener("scroll", function() {
        if (allowMoreResults && window.scrollY + window.innerHeight + 200 >= document.body.offsetHeight) {
            getMoreInstagramResults();
        }
    });
});