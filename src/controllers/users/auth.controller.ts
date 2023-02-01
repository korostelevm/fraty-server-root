import { CreateOrLogin,TwitterAccount,UpdateTwitterCredentials,TwitterAuthTokens } from "../../services/users/auth.service";
import { Response, Request } from "express";
import { generateToken } from "../../utils/tokenGenerator";
import { requestClient, TOKENS } from "../../../config/twitterConfig"
import { TwitterApi, ApiResponseError,TwitterV2IncludesHelper  } from 'twitter-api-v2'
import { FetchTwitter } from "../../services/users/task.service";


const LoginUser = async (req: Request, res: Response) => {
    const { wallet, isMagicAuth } = req.body;
    try{
        const data:any = await CreateOrLogin(wallet,isMagicAuth);
        if (data?.error) {
          return res.status(400).json({
            error: data.error,
          });
        }
        const token = await generateToken(wallet);
          return res.status(200).json({
            token,
            user:data?.user,
            firstTime: data?.firstTime,
          });
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

const TwitterLogin = async (req:Request, res:Response) => {
  const { redirect_uri, wallet } = req.query;
  try {

    const { url, oauth_token, oauth_token_secret } =
      await requestClient.generateAuthLink(
       process.env.TWITTER_CALLBACK_URL,
      );
      const data:any = await TwitterAccount(wallet, redirect_uri, oauth_token, oauth_token_secret);
      if (data?.error) {
        return res.status(400).json({
          error: data?.error,
        });
      }
    await res.redirect(`${url}&state=${wallet}`);
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error,
    });
  }
};

const TwitterCallback = async (req:Request, res:Response) => {
  if (!req.query.oauth_token || !req.query.oauth_verifier) {
    return res
      .status(400)
      .send(
        "Bad request, or you denied application access. Please renew your request."
      );
  }
  const { oauth_token, oauth_verifier } = req.query;
  try {
    const { user,error} = await TwitterAuthTokens(oauth_token);
    if(error) return res.status(400).json({error: error})
    const token =  oauth_token
    const verifier = oauth_verifier;
    const savedToken = user?.accessToken;
    const savedSecret = user?.accessSecret;
    if (!savedToken || !savedSecret) {
      res
        .status(400)
        .send(
          "OAuth token is not known or invalid. Your request may have expire. Please renew the auth process."
        );
      return;
    }


    const tempClient = new TwitterApi({
      ...TOKENS,
          //@ts-ignore
      accessToken: token,
      accessSecret: savedSecret,
    });

    const { accessToken, accessSecret, screenName, userId } =
        //@ts-ignore
      await tempClient.login(verifier);
    const data:any = await UpdateTwitterCredentials(
      user?.wallet,
      accessToken,
      accessSecret,
      screenName,
      userId
    );
    if (data?.error) {
      return res.status(400).json({
        error: data?.error,
      });
    }
    return await res.redirect(data)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error,
    });
  }
};


const TwitterFollow = async(wallet:string,handle:string) => {
  const data:any = await FetchTwitter(wallet);
  if(data?.error){
     return data?.error
  }
  const { accessToken, accessSecret, twitter_id, username } = data;
  const client = new TwitterApi({...TOKENS, accessToken, accessSecret});
  try{
    let regex = '(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:#!\/)?@?([^\/\?\s]*)';
    let TwitterHandle = handle?.includes("https://twitter.com") ? handle?.match(regex)[1] : handle;
    const FollowCheck = await client.v2.userByUsername(TwitterHandle);
    let FollowId = FollowCheck.data?.id;
    const { relationship } = await client.v1.friendship({
      source_id: twitter_id,
      target_id: FollowId,
    });
    if(relationship.source.following === true){
      return {
        follow: true,
      }
    } 
    return {
      error: "User is not following " + TwitterHandle,
    }
  }
  catch(error){
     return error
  }
}

const TwitterTweet = async(wallet:string,tweetData:any) => {
  const data:any = await FetchTwitter(wallet);
  if(data?.error){
     return data?.error
  }
  const { accessToken, accessSecret, twitter_id, username } = data;
  const client = new TwitterApi({...TOKENS, accessToken, accessSecret});
  try{
    const tweet = await client.v2.userTimeline(twitter_id, { max_results: 10 });
    let status:any | boolean = false
    await tweet.data?.data?.map(async(tweets) => {
        if(tweets?.text?.includes(tweetData)) status = true
    })
    return status === true ? status : {error: "User has not tweeted " + tweetData}
  }
  catch(error){
     return error
  }
}

const TwitterRetweet = async(wallet:string,tweetData:any) => {
  try{
    const data:any = await FetchTwitter(wallet);
    if(data?.error){
       return data?.error
    }
    const { accessToken, accessSecret, twitter_id, username } = data;
    const client = new TwitterApi({...TOKENS, accessToken, accessSecret});
    let status:any | boolean = false
    let regex = "(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:#!\/)?@?([^\/\?\s]*)\/status\/([^\/\?\s]*)";
    let tweetId = tweetData?.includes("https://twitter.com") ? tweetData?.match(regex)[2] : tweetData;
    let retweetData = await client.v1.get('statuses/retweets/' + tweetId + ".json" , {
      id: tweetId,
      count: 1,
    })
    if(retweetData[0]?.retweeted === true) status = true
    return status === true ? status : {error: "User has not retweeted the tweet"}
  }
  catch(error){
     return error
  }
}

export { LoginUser, TwitterLogin, TwitterCallback, TwitterFollow, TwitterTweet, TwitterRetweet };
