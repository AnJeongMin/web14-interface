/*  */
import React from 'react';
import { PHASE_TYPE } from '@constants/phase.constant';
import useSafeNavigate from '@hooks/useSafeNavigate';
import usePreventLeave from '@hooks/usePreventLeave';
import { webRTCStreamSelector } from '@store/webRTC.atom';
import { useRecoilValue } from 'recoil';
import Video from '@components/@shared/Video/Video';

const Interviewee = () => {
	usePreventLeave();
	const { safeNavigate } = useSafeNavigate();

	const streamList = useRecoilValue(webRTCStreamSelector);

	return (
		<>
			<div>Interviewee</div>
			{streamList.map((stream) => (
				<Video key={stream.id} src={stream} width={200} autoplay muted />
			))}
			<button onClick={() => safeNavigate(PHASE_TYPE.WAITTING_PHASE)}>면접 종료</button>
		</>
	);
};

export default Interviewee;
