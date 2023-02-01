interface IRewardAdd {
	points: number;
	type: string;
	image: string;
	name: string;
	description: string;
	level: number;
	claim_method: string;
	qty: number;
}

interface IRewardUpdate {
	id: string;
	points: number;
	type: string;
	image: string;
	name: string;
	description: string;
	level: number;
	claim_method: string;
	qty: number;
	status: boolean;
}

interface IRewardDelete {
	id: string;
}

interface IRewardGet {
	id: string;
}

export { IRewardAdd, IRewardUpdate, IRewardDelete, IRewardGet };
