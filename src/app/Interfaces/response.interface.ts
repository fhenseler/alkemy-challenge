export interface IResponse {

	status: number;
	ok: boolean;
	token: string;
	message: string;
	error: {error: string};

}
