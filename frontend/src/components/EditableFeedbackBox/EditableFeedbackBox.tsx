import React from 'react';
import { FeedbackBox } from '@components/@shared/FeedbackBox/FeedbackBox';

import { ReactComponent as DeleteIcon } from '@assets/icon/delete.svg';
import { ReactComponent as EditIcon } from '@assets/icon/edit.svg';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { feedbackIdsState, feedbackState } from '@store/feedback.atom';
import {
	currentVideoTimeSelector,
	focusIndexState,
	isFbClickedState,
	isFbSyncState,
} from '@store/currentVideoTime.atom';

interface PropsType {
	startTime: number;
	index: number;
}
const EditableFeedbackBox = ({ startTime, index }: PropsType) => {
	const [feedback, setFeedback] = useRecoilState(feedbackState(startTime));
	const deleteFeedback = useResetRecoilState(feedbackState(startTime));
	const isFbSync = useRecoilValue(isFbSyncState);
	const setFocusIndex = useSetRecoilState(focusIndexState);
	const setIsFbClicked = useSetRecoilState(isFbClickedState);
	const setCurrentVideoTime = useSetRecoilState(currentVideoTimeSelector(startTime));
	const setfeedbackIdsState = useSetRecoilState(feedbackIdsState);

	const { content, readOnly } = feedback;

	const handleClickFeedback = () => {
		if (!isFbSync) return;
		setFocusIndex(index);
		setIsFbClicked(true);
		setCurrentVideoTime(feedback.startTime);
	};

	const handleStartEditFeedback = () => {
		setFeedback((fb) => {
			return { ...fb, readOnly: false };
		});
	};

	const handleEndEditFeedback = () => {
		setFeedback((fb) => {
			return {
				...fb,
				readOnly: true,
			};
		});
	};

	const handleFbChange = (e) => {
		setFeedback((fb) => {
			return {
				...fb,
				content: e.target.value,
			};
		});
	};

	const handleDeleteFeedback = () => {
		deleteFeedback();
		setfeedbackIdsState((fbIds) => fbIds.filter((st) => st !== startTime));
	};

	return (
		<FeedbackBox onClick={handleClickFeedback}>
			<FeedbackBox.StartTime>{startTime}</FeedbackBox.StartTime>
			<FeedbackBox.Content value={content} onChange={handleFbChange} readOnly={readOnly} />
			<FeedbackBox.Btn onClick={handleDeleteFeedback}>
				<DeleteIcon width={20} />
			</FeedbackBox.Btn>
			<FeedbackBox.Btn>
				{readOnly ? (
					<EditIcon onClick={handleStartEditFeedback} width={20} />
				) : (
					<button onClick={handleEndEditFeedback}>수정완료</button>
				)}
			</FeedbackBox.Btn>
		</FeedbackBox>
	);
};

export default React.memo(EditableFeedbackBox);
