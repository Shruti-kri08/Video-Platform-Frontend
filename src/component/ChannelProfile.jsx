import { useEffect, useState } from "react"
import defaultChannelCoverImage from "../assets/coverImage.jpg"
import { useParams } from "react-router-dom";
import axios from "axios"
import defaultProfileImage from "../assets/profile.png"
import { useNavigate } from "react-router-dom"


const ChannelProfile = () => {

    useEffect(() => {
        getChannel(),
        getVideoByChannelId()
    }, [])

    const { channelId } = useParams()

    const api_base_url = import.meta.env.VITE_API_URL
    const navigate=useNavigate()

    const [channelInfo, setChannelInfo] = useState({})
    const [isLoading, setLoader] = useState(false)


    const[videos,setVideos]=useState([])
    const[isAllVideoLoading,setAllVideoLoader]=useState(false)

    const getChannel = async () => {
        try {
            setLoader(true)
            console.log('channelId', channelId);

            const data = await axios.get(`${api_base_url}/user/getChannelInfo/${channelId}`)
            console.log(data.data);
            setChannelInfo(data.data)
            setLoader(false)

        }
        catch (err) {
            setLoadder(false)
            console.log(err);

        }
    }
// videoByChannelId
const getVideoByChannelId=async()=>{
    try{
        setAllVideoLoader(true)
        const video=await axios.get(`${api_base_url}/video/allVideoByChannelId/${channelId}`)
        console.log('hii');
        setVideos(video.data)
        console.log(video.data);
        setAllVideoLoader(false)

    }
    catch(err){
        setAllVideoLoader(false)
        console.log(err);
        
    }
}
    return (
        <div>
            {
                isLoading ?
                    <div><span> <i className="fa-solid fa-spinner fa-spin-pulse"></i></span></div>
                    :
                    <div className="channelProfile-page">

                        <div className="channelProfile-cover-profile">

                            <div>
                                <img src={channelInfo.coverImageUrl ? channelInfo.coverImageUrl : defaultChannelCoverImage} className={channelInfo.coverImageUrl ? "channel-channelInfo-coverImage" : "channel-Default-coverImage"} />
                            </div>
                            <div className="channel-info-wrapper">
                                <div className="channel-profileIImageUrl-wrapper">
                                    <img src={channelInfo.profileIImageUrl ? channelInfo.profileIImageUrl : defaultProfileImage} className="channel-profileIImage" />
                                </div>
                                <div>
                                    <div className="channel-info">{channelInfo.channelName}</div>
                                    <div className="channel-info">{channelInfo.subscriber} Subscriber</div>
                                </div>
                            </div>

                           {channelId==localStorage.getItem('userId') && <button className="edit-profile-btn">
                              <span><i className="fa-regular fa-pen-to-square"></i></span>  Edit</button>
                            }


                        </div>
                       
                        <div className="channel-allvideos-wrapper">
                            {
                              isAllVideoLoading?
                                <div><span> <i className="fa-solid fa-spinner fa-spin-pulse"></i></span></div>
                                :
                                // <div className="channel-videos-box" >
                                //     {
                                //         videos.map(video=>(
                                //             <div className="video-box">
                                //                 <div className="thumbnail-wrapper">Thumbnailbox</div>
                                //                 <div>detail box</div>
                                //             </div>
                                //         ))
                                //     }
                                    

                                // </div>
                            videos.map(video => {
                                                        return (
                                                            <div className='video-card' key={video._id} onClick={() => { navigate(`/video/${video._id}`) }} >
                                
                                
                                
                                                                <img className="video-thumbnail" src={video.thumbnailUrl}
                                                                    alt="thumbnail" />
                                
                                
                                
                                                                <div className='video-detail'>
                                                                    <h1>{video.title}</h1>
                                                                    <p>{video.description.slice(0, 100)}
                                                                        {video.description.length > 100 && "......"}
                                                                    </p>
                                                                    <p className="category">{video.category}</p>
                                                                    <div>
                                                                        <div className='profile-box'>
                                                                            <img
                                                                                className='user-profile'
                                                                                src={
                                                                                    video.uploadedBy.profileImageUrl
                                                        ? video.uploadedBy.profileImageUrl
                                                                                        : defaultProfileImage
                                                                                }
                                                                                alt="profile"
                                                                            />
                                                                            <p>{video.uploadedBy.channelName}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p>{Math.floor((Date.now() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24)) != 0 ? Math.floor((Date.now() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24)) + " day ago" : "Today"}</p>
                                                                            <p >{video.views} views</p>
                                
                                                                        </div>
                                                                    </div>
                                                                    
                                                                </div>
                                                                {channelId==localStorage.getItem('userId') && <div className="edit-delete-btn-wrapper">
                                                                   <div className="edit-delete-btn"> <button><span><i className="fa-regular fa-pen-to-square"></i></span> Edit</button>
                                                                    <button><span><i className="fa-solid fa-trash"></i></span> Delete</button></div>
                                                                </div>}
                                                            </div>
                                                        )
                                                    })
                            }
                        </div>
                    </div>

            }
        </div>
    )
}
export default ChannelProfile