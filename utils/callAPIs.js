const instagram_access_token = process.env.instagram_access_token;
const instagram_user_id = process.env.instagram_user_id;
const youtube_access_token = process.env.youtube_access_token;
const youtube_playlist_id = process.env.youtube_playlist_id;

async function loadInstagramData() {
    const res = await fetch(`https://graph.facebook.com/${instagram_user_id}?access_token=${instagram_access_token}&fields=
        username,name,biography,media_count,followers_count,follows_count,profile_picture_url,
        media{media_type,thumbnail_url,permalink,like_count,comments_count}`)
    .then(res => res.json());

    if (res.error) {
        console.log(res.error);
        return undefined;
    }

    return res;
}

async function loadYouTubeData() {
    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=3&fields=items(contentDetails(videoId))&playlistId=${youtube_playlist_id}&key=${youtube_access_token}`).then(res => res.json());

    if (res.error) {
        console.log(res.error);
        return undefined;
    }
    
    return res.items.map(item => item.contentDetails.videoId);
}

async function callAPIs() {
    const instagramData = loadInstagramData();
    const youtubeData = loadYouTubeData();

    return {
        instagramData: await instagramData,
        youtubeData: await youtubeData
    };
}

module.exports = callAPIs;