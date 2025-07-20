import { Model } from 'mongoose';
import { UserDocument } from '@schema/user.schema';
import { UserWithImageCount } from '@users/type';

type Props = (
  userShema: Model<UserDocument>,
  params: { limit: number; skip: number },
) => Promise<UserWithImageCount[]>;

const userList: Props = async (userShema, { skip, limit }) => {
  const data = await userShema.aggregate([
    {
      $lookup: {
        from: 'user-images',
        localField: '_id',
        foreignField: 'user',
        as: 'images',
      },
    },
    {
      $addFields: {
        imageCount: { $size: '$images' },
      },
    },
    {
      $sort: { imageCount: -1 },
    },
    {
      $project: {
        name: 1,
        city: 1,
        imageCount: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  return data;
};

export default userList;
