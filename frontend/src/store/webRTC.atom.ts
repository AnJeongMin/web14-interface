import { atom, selector } from 'recoil';

export const webRTCMyStreamState = atom({
	key: 'webRTCMyStreamState',
	default: null,
});

export const webRTCUserListState = atom({
	key: 'webRTCUserListState',
	default: new Map(),
});

export const webRTCStreamSelector = selector({
	key: 'webRTCStreamSelector',
	get: ({ get }) => {
		return Array.from(get(webRTCUserListState).values()).map(({ stream }) => stream);
	},
});