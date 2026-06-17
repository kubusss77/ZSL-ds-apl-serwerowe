import { photos, users } from '../../model.js';
import { sendJson, sendMessage } from '../../utils/http.utils.js';
import { sendNotificationToUser } from '../notifications/subscribe.controller.js';

function getPhotoOwner(photo) {
  if (typeof photo.ownerId === 'number') {
    return users.find((user) => user.id === photo.ownerId);
  }

  if (photo.ownerEmail) {
    return users.find((user) => user.email === photo.ownerEmail);
  }

  return users.find((user) => user.email === photo.album);
}

export async function likePhoto(req, res) {
  const matched = req.url.match(/^\/api\/photos\/([0-9]+)\/like$/);
  const id = parseInt(matched?.[1], 10);

  if (isNaN(id)) {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  const photo = photos.find((item) => item.id === id);

  if (!photo) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  const owner = getPhotoOwner(photo);

  if (!owner) {
    sendMessage(res, 400, 'Photo owner not found');
    return;
  }

  if (owner.id === req.user.id) {
    sendMessage(res, 400, 'Cannot like your own photo');
    return;
  }

  photo.likes ??= [];

  if (photo.likes.some((like) => like.userId === req.user.id)) {
    sendJson(res, 200, {
      message: 'Photo already liked',
      photo,
    });
    return;
  }

  const like = {
    userId: req.user.id,
    userEmail: req.user.email,
    timestamp: Date.now(),
  };

  photo.likes.push(like);

  const delivered = sendNotificationToUser(owner.id, {
    type: 'photo-like',
    photoId: photo.id,
    likedBy: req.user.email,
    ownerEmail: owner.email,
    timestamp: like.timestamp,
  });

  sendJson(res, 201, {
    message: 'Photo liked',
    delivered,
    photo,
  });
}
