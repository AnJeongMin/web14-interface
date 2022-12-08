import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import useCrudFeedback from '@hooks/useCrudFeedback';
import { isFbClickedState, isFbSyncState } from '@store/feedback.store';
import { currentVideoTimeState } from '@store/currentVideoTime.store';

import { feedbackBoxStyle, fbTextAreaStyle, fbStartTimeStyle } from './FeedbackItem.style';

import { FeedbackItemType } from '@customType/feedback';

interface PropsType {
	feedback: FeedbackItemType;
	//TODO ref type any
	feedbackRef: React.MutableRefObject<any[]>;
	index: number;
	editableBtns: React.ReactNode;
}
const FeedbackItem = ({ feedback, feedbackRef, index, editableBtns }: PropsType) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const isFbSync = useRecoilValue(isFbSyncState);
	const setIsFbClicked = useSetRecoilState(isFbClickedState);
	const setCurrentVideoTime = useSetRecoilState(currentVideoTimeState);
	const { handleFbChange } = useCrudFeedback(feedback.id);

	useEffect(() => {
		feedbackRef.current[index].style.height = textareaRef.current.scrollHeight + 'px';
	});

	const { startTime, isFirst, content, readOnly } = feedback;

	const handleClickFeedback = () => {
		if (!isFbSync) return;
		setIsFbClicked(true);
		setCurrentVideoTime(startTime);
	};

	return (
		<div ref={(el) => (feedbackRef.current[index] = el)} css={feedbackBoxStyle}>
			<div css={fbStartTimeStyle} style={{ visibility: isFirst ? 'visible' : 'hidden' }}>
				{startTime}
			</div>
			<textarea
				ref={textareaRef}
				value={content}
				onChange={(e) => handleFbChange(e.target.value)}
				readOnly={readOnly}
				onClick={handleClickFeedback}
				css={fbTextAreaStyle}
			/>
			{editableBtns}
		</div>
	);
};

export default React.memo(FeedbackItem);
