import { DiscordAccount, UpdateDiscordCredentials } from '../../services/users/auth.service'
import { FetchDiscord } from '../../services/users/task.service';
import axios from 'axios';

import { Response, Request } from 'express';



  const DiscordLogin = async (req:Request, res:Response) => {
    const { wallet, redirect_uri } = req.query;
    try {
      const data:any | object = await DiscordAccount(wallet as string, redirect_uri as string);
      if (data?.error) {
        return res.status(400).json({
          error: data?.error,
        });
      }
      res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&response_type=code&scope=identify%20email%20guilds&state=${wallet}`
      )
    } catch (error) {
      return res.status(400).json({
        error: "Oops! Something went wrong.",
      });
    }
  };
  
  const DiscordCallback = async (req:Request, res:Response) => {
    const { state:wallet } = req.query as any;
    const code = req.query.code as string;
    
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_ID,
      client_secret: process.env.DISCORD_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.DISCORD_CALLBACK_URL
  });

    try {
      if (!wallet) {
        return res.status(400).json({
          error: "User not found.",
        });
      }
      const tokenRes:any = await axios.post('https://discordapp.com/api/oauth2/token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const user:any = await axios.get('https://discord.com/api/users/@me', {
          headers: {
              Authorization: `Bearer ${tokenRes.data.access_token}`
          }
      })
      
      const data:any = await UpdateDiscordCredentials(wallet, tokenRes.data.access_token,tokenRes.data.refresh_token,user.data.username,user.data.id)
      if (data?.error) return res.redirect(data + "error=" + data?.error)
      return await res.redirect(data);
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error: error,
        message: "Oops! Something went wrong.",
      });
    }
  };
  
  const DiscordGuildCheck = async(wallet:string,guild:string) => {
      const user:any = await FetchDiscord(wallet);
      if(user?.error) return { error: user?.error }
      try{
        const epoch = new Date(user?.updatedAt).getTime();
        let token = user?.accessToken;
        if(epoch < Date.now() - 518400) {
        const { data } = await axios.post("https://discord.com/api/oauth2/token",
        `client_id=${process.env.DISCORD_ID}&client_secret=${process.env.DISCORD_SECRET}&grant_type=refresh_token&refresh_token=${user?.refreshToken}&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&scope=identify%20email%20guilds`,
        {
          headers:{
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        await UpdateDiscordCredentials(
          wallet,
          data?.access_token,
          data?.refresh_token,
          user?.username,
          user?.discordId
        );
        token = data?.access_token;
        console.log("new token",token)
        }
      

      const check = await axios.get('https://discord.com/api/users/@me/guilds', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      const guilds = await check.data.map((guild:any) => guild.id)
      if(guilds.includes(guild)) return { message: "You are in the guild" }
      return { error: "You are not in the guild" }
      } catch(error){
          console.log(error)
          return { error: error }
      }
  }


const DiscordRoleCheck = async(wallet:string,guild:string,role:string) => {
    const user:any = await FetchDiscord(wallet);
    if(user?.error) return { error: user?.error }
    try{
    const check = await axios.get(`https://discord.com/api/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${user?.accessToken}`
        }
    })
    console.log(check.data)
    const guilds = await check.data.map((guild:any) => guild.id)
    
    if(guilds.includes(guild)) {
      return { message: "You are in the guild" }
    }
    return { error: "You are not in the guild" }
    } catch(error){
        console.log(error)
        return { error: error }
    }
}

export { DiscordLogin, DiscordCallback, DiscordGuildCheck, DiscordRoleCheck }