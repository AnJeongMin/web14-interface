import React, { forwardRef, useEffect, useRef } from 'react';
import { nameTagStyle, streamVideoStyle, streamVideoWrapperStyle } from './StreamVideo.style';

import { ReactComponent as MicOnIcon } from '@assets/icon/mic_on.svg';
import { ReactComponent as MicOffIcon } from '@assets/icon/mic_off.svg';

export interface StreamVideoPropType {
	src: MediaStream;
	nickname: string;
	width?: string;
	height?: string;
	muted?: boolean;
}

const Video = ({ src, nickname, width, height, muted }: StreamVideoPropType, ref) => {
	const videoRef = ref ? ref : useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (!videoRef.current) return;

		videoRef.current.srcObject = src;
		videoRef.current.controls = false;

		src.getAudioTracks().forEach((track) => {
			track.enabled = !muted;
		});
	}, [src]);

	return (
		<div css={(theme) => streamVideoWrapperStyle(theme, width, height)}>
			<video css={streamVideoStyle} ref={videoRef} autoPlay playsInline />
			<span css={(theme) => nameTagStyle(theme, muted)}>
				{muted ? <MicOffIcon /> : <MicOnIcon />}
				<span>{nickname}</span>
			</span>
		</div>
	);
};

export default forwardRef(Video);
