import { PostSanitize } from './../modules/post/post.interfaces';
import { LoginSanitize, SignupSanitize } from "./../modules/auth/auth.interfaces";
import { CommentSanitize } from './../modules/comment/comment.interfaces';

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
  });
  comment = (comment: CommentSanitize) => ({
    id: comment.id,
    commentAuthor: comment.commentAuthor,
    desc: comment.desc,
    postId: comment.postId
  });
}

export default SanitizeData;