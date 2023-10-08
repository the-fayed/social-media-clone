import { PostSanitize } from './../modules/post/post.interfaces';
import { LoginSanitize, SignupSanitize } from "./../modules/auth/auth.interfaces";
import { CommentSanitize } from './../modules/comment/comment.interfaces';
import { StorySanitize } from './../modules/story/story.interfaces';

class SanitizeData {
  userLogin = (user: LoginSanitize) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  userSignup = (user: SignupSanitize) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
  });
  post = (post: PostSanitize) => ({
    id: post.id,
    desc: post.desc,
    image: post.image,
    postAuthor: post.postAuthor,
    likes: post.likes,
    comments: post.comments,
    privacy: post.privacy
  });
  comment = (comment: CommentSanitize) => ({
    id: comment.id,
    commentAuthor: comment.commentAuthor,
    desc: comment.desc,
    postId: comment.postId
  });
  story = (story: StorySanitize) => ({
    id: story.id,
    storyAuthor: story.storyAuthor,
    image: story.image
  })
}

export default SanitizeData;