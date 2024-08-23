import mongoose, {deleteModel, isValidObjectId} from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400, " VideoId not found");
    }

    const isLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if(!isLiked){
        const like= await Like.create(
        {
            video: videoId,
            likedBy: req.user._id
        }
        )

        if(!like){
            throw new ApiError(400, "Error while liking");
        }
    }
    else{
        await Like.findByIdAndDelete(isLiked._id)
    }

    const videoLiked = await Like.findOne(
        {
            video: videoId,
            likedBy: req.user._id
        }
    )

    let isVideoLiked;

    if(!videoLiked){
        isVideoLiked=false;
    } else{
        isVideoLiked=true;
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{isVideoLiked},"video liked"));

})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const { commentId } = req.params;

    if(!commentId){
        throw new ApiError(200, "No commentId found");
    }
    
    const commentLikeExists = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    })
    
    if(!commentLikeExists){
        const likeCreated = await Like.create({
            comment: commentId,
            likedBy: req.user._id  
        })

        if(!likeCreated){
            throw new ApiError(400, "error while liking the comment");
        }

    } else{
        await Like.findOneAndDelete(commentLikeExists._id);
    }

    const findLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    let likeStatus;

    if(!findLike){
        likeStatus=false;
    }
    else{
        likeStatus=true;
    }

    return res
    .status(200)
    .json(new ApiResponse(200, { likeStatus } , "likeStatus returned successfully"));
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    
    const {tweetId} = req.params;

    if(!tweetId){
        throw new ApiError(400, "Tweet not found");
    }

    const findTweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if(!findTweetLike){

        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
        })

        if(!like){
            throw new ApiError(400,"error while liking the tweet");
        }

    } else{
        await Like.findByIdAndDelete(findTweetLike._id);
    }

    const findLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    let likeStatus;
    
    if(!findLike){
        likeStatus=false;
    }
    else{
        likeStatus=true;
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {likeStatus}, "comment liked Successfully"));

})

const getLikedVideos = asyncHandler(async(req,res)=>{

    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: {$ne : null}
    }).populate("video")
    
    if(!likedVideos){
        throw new ApiError(404, "No liked video found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "liked videos fetched"));
    
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
};

