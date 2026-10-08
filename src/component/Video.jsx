import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import profile from "../assets/profile.png"

const Video = () => {


  useEffect(() => {
    getVideo();
    getComment()
  }, [])

  const [isLoading, setLoading] = useState(true)
  const [commentLoading, setcommentLoading] = useState(false)
  const [comment, setComment] = useState("")
  const [commentList, setCommentList] = useState([])
  const [isSubscribe, setSubscribe] = useState(false)
 const [isLike,setLike]=useState(false)
 const [isDislike,setDislike]=useState(false)
 
  const videoId = useParams()
  const [video, setVideo] = useState({})
  const api_base_url = import.meta.env.VITE_API_URL
// const navigate=useNavigate()

// const navigateToLogin=()=>{
//     navigate('/login')
// }

  const getVideo = async () => {
    try {
      setLoading(true)
      console.log(videoId.id);

      const d = await axios.get(`${api_base_url}/video/videoById/${videoId.id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      
      console.log(d);
      console.log('video', d.data.data)
      setVideo(d.data.data)
      setSubscribe(d.data.data.subscribeStatus)
      setLike(d.data.data.likeStatus)
      setDislike(d.data.data.dislikeStatus)
      setLoading(false)
    }
    catch(err){
      setLoading(false)
      console.log(err);
    }
  }


  const subscribe = async (channeId) => {
    try {
     
      if(localStorage.getItem('token')==null){
        navigateToLogin()
        return
      }

      console.log(isSubscribe)
      setSubscribe(!isSubscribe)
      const subscribeRes=await axios.put(`${api_base_url}/user/${isSubscribe ? 'unsubscribe' : 'subscribe'}/${channeId}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(subscribeRes);
      
    }
    
    catch (err) {
      setSubscribe(!isSubscribe)
      swal({
        text: "Something is wrong!",
        icon: "error",
        button: "Ok",
      });
    }
  }

const likeHandler=async()=>{
  try{

     if(localStorage.getItem('token')==null){
        navigateToLogin()
        return
      }
    setLike(!isLike)
    setDislike(false)
    const likeRes=await axios.put(`${api_base_url}/video/like/${videoId.id}` ,{},
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    console.log(likeRes)

  }
  catch(err){
     setLike(!isLike)
    swal({
        text: "Something is wrong!",
        icon: "error",
        button: "Ok",
      });
  }
}

const dislikeHandler=async()=>{
   try{
     if(localStorage.getItem('token')==null){
        navigateToLogin()
        return
      }
    setLike(false)
    setDislike(!isDislike)
    const dislikeRes=await axios.put(`${api_base_url}/video/dislike/${videoId.id}` ,{},
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    console.log(dislikeRes)

  }
  catch(err){
     setLike(!isDislike)
    swal({
        text: "Something is wrong!",
        icon: "error",
        button: "Ok",
      });
  }
}

  const addComment = async () => {
    try {
       if(localStorage.getItem('token')==null){
        navigateToLogin()
        return
      }
      const token = localStorage.getItem('token')
      setcommentLoading(true)
      await axios.post(`${api_base_url}/comment/addComment/${videoId.id}`, { commentText: comment }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setcommentLoading(false)
      await swal("New Comment!", "New Comment Added!", "success");
      setComment('')
      getComment()
    }
    catch (err) {
      setcommentLoading(false)
      swal({
        text: "Something is wrong!",
        icon: "error",
        button: "Ok",
      });
    }
  }

  const getComment = async () => {
    try {
      const commentRes = await axios.get(`${api_base_url}/comment/getComment/${videoId.id}`,{
         headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      setCommentList(commentRes.data.reverse())
    }
    catch (err) {
      swal({
        text: "Something is wrong!",
        icon: "error",
        button: "Ok",
      });
    }
  }

  const likeCommentHandler=async (commentId)=>{
    try{
      const token=localStorage.getItem('token')
      console.log("likeCommentHandler");
      setCommentList(commentList.map((comment)=>{
          if(comment._id!=commentId){
            return comment;
          }
          return {
            ...comment,
            isLike:!comment.isLike,
            isDislike:comment.isDislike ? false : comment.isDislike
          }

      }))

      const likeRes=await axios.put(`${api_base_url}/comment/like/${commentId}`,{},{
       headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(likeRes.data.likeStatus);
      
      
    }
    catch(err){
swal({
        text: "Something is wrong!",
        icon: "error",
        button: "Ok",
      });
    }
  }

  const dislikeCommentHandler=async (commentId)=>{
    try{
      const token=localStorage.getItem('token')
      console.log("dislikeCommentHandler");
      setCommentList(commentList.map((comment)=>{
          if(comment._id!=commentId){
            return comment;
          }
          return {
            ...comment,
            isDislike:!comment.isDislike,
            isLike:comment.isLike ? false : comment.isLike
          }

      }))

      const dislikeRes=await axios.put(`${api_base_url}/comment/dislike/${commentId}`,{},{
       headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(dislikeRes.data.dislikeStatus);
      
      
    }
    catch(err){
swal({
        text: "Something is wrong!",
        icon: "error",
        button: "Ok",
      });
    }
  }


  return (
    <div className="video">
      {
        isLoading ? <div className="videoLoader"><span> <i className="fa-solid fa-spinner fa-spin-pulse"></i></span> </div>
          :
          <div className='video-left'>  <video src={video.videoUrl} controls className='video-player'></video>
            <h1 className='video-title'>{video.title}</h1>
            <p>{video.views} views, {video.likeCount} likes</p>
            <div className='video-user-wrapper'>
              <div className='channel-info'>
                <img className="user-profile" src={video.uploadedBy.profileImageUrl ? video.uploadedBy.profileImageUrl : profile} />
                <div>
                  <p className='channelName'>{video.uploadedBy.channelName}</p>
                </div>
              </div>
              {video.uploadedBy._id != localStorage.getItem('userId') && localStorage.getItem('token') && <div className='like-dislike-subscrib-wrapper'>
               {!isLike && <span className='like-dislike' onClick={likeHandler}><i className="fa-regular fa-thumbs-up"></i></span>}
               {isLike && <span className='like-dislike' onClick={likeHandler} ><i className="fa-solid fa-thumbs-up"></i></span>}
              {!isDislike && <span className='like-dislike' onClick={dislikeHandler} ><i className="fa-regular fa-thumbs-down"></i></span>}
                {isDislike && <span className='like-dislike' onClick={dislikeHandler}><i className="fa-solid fa-thumbs-down"></i></span>}
                <button className='subscribe-btn' type='button' onClick={() => {
                  subscribe(video.uploadedBy._id)
                }}>{!isSubscribe && <span><i className="fa-regular fa-bell"></i></span>}{!isSubscribe ? 'Subscribe' : 'Unsubscribe'}</button>
              </div>

              }
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: video.description
              }}
            />
            <hr />
            {localStorage.getItem('token') ? <div className='comment-wrapper'>
              <input onChange={(e) => { setComment(e.target.value) }} value={comment} className='comment-box' type="text" placeholder='write comment' />
              <button onClick={addComment} className='comment-btn' type='button'>{commentLoading && <span><i className="fa-solid fa-spinner fa-spin-pulse"></i></span>} Comment</button>
            </div>:
            <h3><br></br>Comments</h3>}

            <div className='commentList-wrapper'>
              {
                commentList.map((c) => {
                  return <div className='comment-card' key={c._id}>
                    {/* {console.log(c)} */}
                    <div className='comment-user-info'>
                      <img className='user-profile' src={c.commentBy.profileImageUrl ? c.commentBy.profileImageUrl : profile} />
                      <p>{c.commentBy
                        .channelName}</p>
                    </div>
                    
                    <p className='commentText'>{c.commentText}</p>
                    
                    
                    <div className='like-dislike-subscrib-wrapper'>
                     {!c.isLike && <span className='like-dislike'  onClick={()=>{likeCommentHandler(c._id)}}><i className="fa-regular fa-thumbs-up"></i></span>}
                     { c.isLike && <span className='like-dislike' onClick={()=>{likeCommentHandler(c._id)}}><i className="fa-solid fa-thumbs-up"></i></span>}
                      {!c.isDislike && <span className='like-dislike' onClick={()=>{dislikeCommentHandler(c._id)}}><i className="fa-regular fa-thumbs-down"></i></span>}
                      {c.isDislike && <sapn className='like-dislike' onClick={()=>{dislikeCommentHandler(c._id)}}><i className="fa-solid fa-thumbs-down"></i></sapn>}
                      </div>

                  </div>
                })
              }
            </div>
          </div>
      }
      <div className='video-right'>

      </div>
    </div>


  )
  
}
export default Video