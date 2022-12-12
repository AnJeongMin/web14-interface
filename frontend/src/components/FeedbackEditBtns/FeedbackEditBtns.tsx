import React from 'react';

import useEditFeedback from '@hooks/useEditFeedback';

import { ReactComponent as DeleteIcon } from '@assets/icon/delete.svg';
import { ReactComponent as EditIcon } from '@assets/icon/edit.svg';
import { ReactComponent as CheckIcon } from '@assets/icon/check.svg';
import { fbBtnContainer } from './FeedbackEditBtns.style';
import Button from '@components/@shared/Button/Button';

interface Props {
	id: string;
	readOnly: boolean;
}

const FeedbackEditBtn = ({ id, readOnly }: Props) => {
	const { handleStartEditFeedback, handleEndEditFeedback, handleDeleteFeedback } =
		useEditFeedback(id);

	return (
		<div css={fbBtnContainer}>
			{readOnly ? (
				<Button color="black" size="small" style="text" onClick={handleStartEditFeedback}>
					<EditIcon />
				</Button>
			) : (
				<Button size="small" style="text" onClick={handleEndEditFeedback}>
					<CheckIcon />
				</Button>
			)}
			<Button color="red" size="small" style="text" onClick={handleDeleteFeedback}>
				<DeleteIcon />
			</Button>
		</div>
	);
};

export default FeedbackEditBtn;
