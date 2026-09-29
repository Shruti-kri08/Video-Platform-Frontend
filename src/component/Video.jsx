import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
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

  const videoId = useParams()
  const [video, setVideo] = useState({})
  const api_base_url = import.meta.env.VITE_API_URL



  const getVideo = async () => {
    try {
      setLoading(true)
      console.log(videoId.id);

      const d = await axios.get(`${api_base_url}/video/videoById/${videoId.id}`)

      console.log('video', d.data.video)
      setVideo(d.data.video)
      setSubscribe(d.data.video.uploadedBy.subscriber.includes(localStorage.getItem('userId')))
      setLoading(false)
    }
    catch {
      setLoading(false)
      console.log(err);
    }
  }


  const subscribe = async (channeId) => {
    try {
      setSubscribe(!isSubscribe)
      const susbcribeRes = await axios.put(`${api_base_url}/user/${isSubscribe ? 'unsubscribe' : 'subscribe'}/${channeId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log((susbcribeRes));
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


  const addComment = async () => {
    try {
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
      const commentRes = await axios.get(`${api_base_url}/comment/getComment/${videoId.id}`)
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
  return (
    <div className="video">
      {
        isLoading ? <div className="videoLoader"><span> <i className="fa-solid fa-spinner fa-spin-pulse"></i></span> </div>
          :
          <div className='video-left'>  <video src={video.videoUrl} controls className='video-player'></video>
            <h1 className='video-title'>{video.title}</h1>
            <p>{video.views} views, {video.likeUser.length} likes</p>
            <div className='video-user-wrapper'>
              <div className='channel-info'>
                <img className="user-profile" src={video.uploadedBy.profileImageUrl ? video.uploadedBy.profileImageUrl : profile} />
                <div>
                  <p className='channelName'>{video.uploadedBy.channelName}</p>
                  <p>{video.uploadedBy.subscriber.length} Subscribers</p>
                </div>
              </div>
              {video.uploadedBy._id != localStorage.getItem('userId') && <div className='like-dislike-subscrib-wrapper'>
                <span className='like-dislike'><i className="fa-regular fa-thumbs-up"></i></span>
                <span className='like-dislike'><i className="fa-solid fa-thumbs-up"></i></span>
                <span className='like-dislike'><i className="fa-regular fa-thumbs-down"></i></span>
                <span className='like-dislike'><i className="fa-solid fa-thumbs-down"></i></span>
                <button className='subscribe-btn' type='button' onClick={() => {
                  subscribe(video.uploadedBy
                    ._id)
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
            <div className='comment-wrapper'>
              <input onChange={(e) => { setComment(e.target.value) }} value={comment} className='comment-box' type="text" placeholder='write comment' />
              <button onClick={addComment} className='comment-btn' type='button'>{commentLoading && <span><i className="fa-solid fa-spinner fa-spin-pulse"></i></span>} Comment</button>
            </div>

            <div className='commentList-wrapper'>
              {
                commentList.map((c) => {
                  return <div className='comment-card' key={c._id}>
                    <div className='comment-user-info'>
                      <img className='user-profile' src={c.commentBy.profileImageUrl ? c.commentBy.profileImageUrl : profile} />
                      <p>{c.commentBy
                        .channelName}</p>
                    </div>
                    <p className='commentText'>{c.commentText}</p>

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