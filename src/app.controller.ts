import { Controller, Get, Param } from '@nestjs/common';
import { UserDocument } from './schemas/user.scheme';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument } from './schemas/comment.scheme';

@Controller()
export class AppController {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Comment')
    private commentModel: Model<CommentDocument>,
  ) {}

  @Get()
  getUsers(): Promise<UserDocument[]> {
    return this.userModel.find().populate('comments').exec();
  }

  /* Example: response:
  [
    {
      "_id": "65522386d5d3c3fb708f4668",
      "name": "demo",
      "email": "nobody@example.com",
      "comments": [
        {
          "_id": "65522390d5d3c3fb708f466b",
          "user": "65522386d5d3c3fb708f4668",
          "text": "com-0",
          "__v": 0
        },
        {
          "_id": "655223dbd5d3c3fb708f466f",
          "user": "65522386d5d3c3fb708f4668",
          "text": "com-1",
          "__v": 0
        }
      ],
      "__v": 0
    }
  ]
  */

  @Get('populate-user')
  populateUser() {
    return this.userModel.create({
      name: 'demo',
      email: 'nobody@example.com',
      comments: [],
    });
  }

  @Get('add-comment/:comment')
  async addComment(@Param('comment') param: string) {
    const user = await this.userModel
      .findOne({ name: 'demo' })
      .populate('comments');

    const newComment = await this.commentModel.create({
      user: user,
      text: String(param),
    });

    const updatedUser = await this.userModel.findOneAndUpdate(
      { name: 'demo' },
      { $push: { comments: newComment } },
    );

    return {
      newComment,
      updatedUser,
    };
  }
}

/* Example response:
{
  "newComment": {
    "user": {
      "_id": "65522386d5d3c3fb708f4668",
      "name": "demo",
      "email": "nobody@example.com",
      "comments": [],
      "__v": 0
    },
    "text": "com-0",
    "_id": "65522390d5d3c3fb708f466b",
    "__v": 0
  },
  "updatedUser": {
    "_id": "65522386d5d3c3fb708f4668",
    "name": "demo",
    "email": "nobody@example.com",
    "comments": [],
    "__v": 0
  }
}
*/
