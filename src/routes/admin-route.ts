import express from 'express';
import { signupAdmin, loginAdmin, getAdminProfile, getAllUsers, deleteUser, updateUsersRole, getUsersByIds, reviewPost, getPosts, getVideos } from '../controllers/admin-controller';
import { authorizeAdmin, verifyJWT } from '../middlewares/auth-middleware';

const router = express.Router();

//-----------------ADMIN AUTH----------------

router.post('/admin/signup', signupAdmin);
router.post('/admin/login', loginAdmin);

//----------------ADMIN PROFILE--------------

router.get('/admin/profile', verifyJWT,authorizeAdmin, getAdminProfile);
router.get('/admin/users', verifyJWT,authorizeAdmin, getAllUsers);
router.post("/admin/profiles",verifyJWT, authorizeAdmin, getUsersByIds);
router.get("/admin/usersList", verifyJWT, authorizeAdmin, getAllUsers);
router.delete("/admin/deleteUser/:userId", verifyJWT, authorizeAdmin, deleteUser);
router.put("/admin/updateUserRole/:userId", verifyJWT, authorizeAdmin, updateUsersRole);

//---------------ADMIN CONTENT ---------------

router.put('/admin/reviewPost', verifyJWT, authorizeAdmin, reviewPost);
router.get('/admin/posts', verifyJWT, authorizeAdmin, getPosts);
router.get('/admin/videos', verifyJWT,authorizeAdmin, getVideos);



export default router;