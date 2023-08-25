import { IReview } from "../common/interfaces/entities.interfaces"
import { IReviewRepository } from "../common/interfaces/repos.interfaces"
import { Review } from "../entities/review.entity"
import { FindManyOptions, FindOneOptions } from "typeorm"

export default class ReviewRepository implements IReviewRepository {
    findOne(where: Partial<IReview>): Promise<IReview | null> {
        return Review.findOne({
            where: {
                ...(where as FindOneOptions<Review>),
            },
        })
    }
    findMany(where: Partial<IReview>): Promise<IReview[]> {
        return Review.find({
            where: {
                ...(where as FindManyOptions<Review>),
            },
        })
    }
    create(input: {
        comment: string
        fileId: string
        reviewerId: string
    }): Promise<IReview> {
        const review = Review.create({
            ...input,
        })

        return review.save()
    }
}
