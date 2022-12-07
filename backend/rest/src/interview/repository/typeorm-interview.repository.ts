import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocsRequestDto } from '../dto/request-docs.dto';
import { feedbackBoxDto } from '../dto/request-feedback.dto';
import { FeedbackBuilder } from '../entities/typeorm-feedback.builder';
import { TypeormFeedbackEntity } from '../entities/typeorm-feedback.entity';
import { InterviewDocsBuilder } from '../entities/typeorm-interview-docs.builder';
import { TypeormInterviewDocsEntity } from '../entities/typeorm-interview-docs.entity';
import { InterviewRepository } from './interview.repository';

@Injectable()
export class TypeormInterviewRepository implements InterviewRepository<TypeormInterviewDocsEntity> {
	constructor(
		@InjectRepository(TypeormInterviewDocsEntity)
		private readonly interviewDocsRepository: Repository<TypeormInterviewDocsEntity>,

		@InjectRepository(TypeormFeedbackEntity)
		private readonly feedbackRepository: Repository<TypeormFeedbackEntity>
	) {}

	async saveInterviewDocs({
		userId,
		videoUrl,
		docsDto,
	}: {
		userId: string;
		videoUrl: string;
		docsDto: DocsRequestDto;
	}): Promise<string> {
		const { docsUUID, videoPlayTime, roomUUID } = docsDto;
		const interviewDocsDao = new InterviewDocsBuilder()
			.setId(docsUUID)
			.setUserId(userId)
			.setVideoUrl(videoUrl)
			.setVideoPlayTime(videoPlayTime)
			.setRoomUUID(roomUUID)
			.build();

		const docs = await this.interviewDocsRepository.save(interviewDocsDao);
		return docs.id;
	}

	async getInterviewDocsListByUserId({
		userId,
		docsUUID,
	}: {
		userId: string;
		docsUUID: string;
	}): Promise<TypeormInterviewDocsEntity> {
		const interviewDocsList = await this.interviewDocsRepository
			.createQueryBuilder('docs')
			.leftJoinAndSelect('docs.feedbackList', 'fb')
			.where('docs.user_id = :userId', { userId })
			.andWhere('docs.id = :docsUUID', { docsUUID })
			.orderBy('fb.user_id')
			.addOrderBy('fb.start_time')
			.addOrderBy('fb.inner_index')
			.getOne();

		return interviewDocsList;
	}

	async getInterviewDocsByDocsUUID(docsUUID: string): Promise<TypeormInterviewDocsEntity> {
		const interviewDocs = await this.interviewDocsRepository.findOneBy({ id: docsUUID });
		return interviewDocs;
	}

	async getInterviewDocsInRoomByUserId(args) {
		const interviewDocsList = await this.interviewDocsRepository.find({
			select: { createdAt: true, videoPlayTime: true, id: true },
			where: { ...args },
		});
		return interviewDocsList;
	}

	async deleteInterviewDocs(docsUUID: string): Promise<string> {
		const result = await this.interviewDocsRepository.delete(docsUUID);
		if (!result.affected) {
			throw new Error();
		}

		return docsUUID;
	}

	async saveFeedback({
		userId,
		docs,
		feedbackBoxDto,
	}: {
		userId: string;
		docs: TypeormInterviewDocsEntity;
		feedbackBoxDto: feedbackBoxDto;
	}): Promise<number> {
		const { startTime, innerIndex, content } = feedbackBoxDto;
		const feedback = new FeedbackBuilder()
			.setUserId(userId)
			.setDocs(docs)
			.setStartTime(startTime)
			.setInnerIndex(innerIndex)
			.setContent(content)
			.build();

		const result = await this.feedbackRepository.save(feedback);
		return result.id;
	}
}
