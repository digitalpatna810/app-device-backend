import express from 'express';
import { uploadImage, uploadVideo, getPostById, getUserPosts, deleteContent, getVideoById, filterPosts, filterPostsUser, filterWithTime, searchByKeyword, uploadPdf } from '../controllers/post-controller';
import { verifyJWT } from '../middlewares/auth-middleware';

const router = express.Router();

router.get('/posts/user-posts', verifyJWT, getUserPosts);
router.get('/post/:postId', verifyJWT, getPostById);
router.get('/video/:videoId', verifyJWT, getVideoById);
router.post('/post/image', verifyJWT, uploadImage);
router.post('/post/video', verifyJWT, uploadVideo);
router.post('/post/pdf', verifyJWT, uploadPdf);
router.delete('/deleteContent', verifyJWT, deleteContent);
router.get('/filterPosts', verifyJWT, filterPosts);
router.get('/filterPostsUser', verifyJWT, filterPostsUser);
router.get('/filterWithTime', verifyJWT, filterWithTime);
router.get('/search', verifyJWT, searchByKeyword);



export default router;