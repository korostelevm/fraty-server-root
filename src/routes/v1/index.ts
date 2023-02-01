import express from "express";
import { CampaignStatus } from "../../middleware/CampaignStatus";
const router = express.Router();

import { Auth, Task, Level, Reward, Details, Deploy, userManagement,QR,Campaign,Analytics,Fratty } from "./admin";
import { Auth as UserAuth, Profile as UserProfile,About,Task as UserTask,Leaderboard,Rewards as UserRewards, Nft,FrattyUser } from './user';

interface Route {
	path: string;
	route: express.Router;
}

const defaultRoutes = [
    {
        path: "/admin/auth",
        route: Auth,
    },
    {
        path: "/admin/task",
        route: Task,
    },
    {
        path: "/admin/level",
        route: Level,
    },
    {
        path: "/admin/reward",
        route: Reward,
    },{
        path: "/admin/details",
        route: Details,
    },
	{
		path: "/admin/deploy",
		route: Deploy,
	},
    {
        path: "/admin/usermanagement",
        route: userManagement,
    },{
        path: "/admin/campaign",
        route: Campaign,
    },
    {
        path: "/admin/analytics",
        route: Analytics,
    },
    {
        path: "/admin/fratty",
        route: Fratty,
    },
    {
        path: "/display/qr",
        route: QR,
    },
	{
        path: "/user/auth",
        route: UserAuth,
    },{
        path: "/user/profile",
        route: UserProfile,
    },{
        path: "/user/about",
        route: About,
    },{
        path: "/user/task",
        route: UserTask,
    },{
        path: "/user/leaderboard",
        route: Leaderboard,
    },{
		path: "/user/reward",
		route: UserRewards,
	},
	{
		path: "/user/nft",
		route: Nft,
	},
    {
        path: "/user/fraty",
        route: FrattyUser,
    }
]

defaultRoutes.forEach((route: Route) => {
    if (route.path.includes("/user")) {
        router.use(route.path, CampaignStatus, route.route);
    }
	router.use(route.path, route.route);
});

export default router;