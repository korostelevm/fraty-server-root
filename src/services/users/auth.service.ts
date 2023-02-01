import { Users,Twitter,Discord } from "../../models/user";
//@ts-ignore
import { generateUsername } from "friendly-username-generator";
import { MintNFT } from "../../controllers/users/nft.controller";

const CreateOrLogin = async(wallet: string,isMagicAuth: boolean):Promise<Object> => {
    const user = await Users.findOne({ wallet: wallet });
    if (user) {
        if(user.isMinted === false) await MintNFT(wallet);
        return {
        user: user,
        firstTime: false,
    };
    } else {
        const newUser = new Users({
        wallet: wallet,
        name: generateUsername({
            useRandomNumber: true,
            useHyphen: true,
        }).slice(0, 8),
        isMagicAuth: isMagicAuth,
        });
        await newUser.save();
        await MintNFT(wallet);
        return {
            user: newUser,
            firstTime: true,
        }
    }
}

const TwitterAccount = async (wallet: string | any, redirect_uri: string | any,oauth_token: string, oauth_token_secret:string) => {
    const user = await Twitter.findOne({ wallet: wallet });
    if (!user) {
        const data = await Twitter.create({
            wallet: wallet,
            redirect: redirect_uri,
            accessSecret: oauth_token,
            accessToken: oauth_token_secret,
        });
        return data;
    } else {
        const data = await Twitter.findOneAndUpdate(
            { wallet: wallet },
            { redirect: redirect_uri, accessSecret: oauth_token, accessToken: oauth_token_secret }
        );
        return data;
    }
}

const TwitterAuthTokens = async (oauth_token: string | any) => {
    const user = await Twitter.findOne({ accessSecret: oauth_token });
    if (!user) return { error: "User not found" };
    return { user };
}

const UpdateTwitterCredentials = async (wallet:string | any, accessToken:string | any, accessSecret:string | any, username:string | any, userID:string | any) => {
    const user = await Twitter.findOne({ wallet: wallet });
    if (!user) {
        return { error: "Twitter account not found" };
    } else {
        const data = await Twitter.findOneAndUpdate(
            { wallet: wallet },
            {
                accessToken: accessToken,
                accessSecret: accessSecret,
                username: username,
                twitter_id: userID,
            }
        );
        return data.redirect;
    }
}

const DiscordAccount = async(wallet:string,redirect_uri:string) => {
	const user = await Discord.findOne({ wallet, redirect: redirect_uri });
	if (!user) {
		const data = await Discord.create({
			wallet,
			redirect: redirect_uri,
		});
		return data;
	}
	await Discord.updateOne({ wallet }, { redirect: redirect_uri });
	return user;
}

const UpdateDiscordCredentials = async(wallet:string,accessToken:string,refreshToken:string,username:string,userID:string) => {
	const user = await Discord.findOne({ wallet });
	if (!user) { return {error: "User not found"}; }
	await Discord.updateOne({ wallet:wallet }, { accessToken, refreshToken, username, discord_id: userID });
	return user?.redirect;
}


export { CreateOrLogin, TwitterAccount, UpdateTwitterCredentials,TwitterAuthTokens, DiscordAccount, UpdateDiscordCredentials };