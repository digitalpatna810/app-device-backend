import express from 'express';
import { signupAdmin, loginAdmin, getAdminProfile, getAllUsers, deleteUser, updateUsersRole, getUsersByIds, reviewPost, getPosts, getVideos, getContent, getAllUsersExceptAdmin, getDeletedUsers, retrieveUser } from '../controllers/admin-controller';
import { authorizeAdmin, verifyJWT } from '../middlewares/auth-middleware';

const router = express.Router();

//-----------------ADMIN AUTH----------------

router.post('/admin/signup', signupAdmin);
router.post('/admin/login', loginAdmin);

//----------------ADMIN PROFILE--------------

router.get('/admin/profile', verifyJWT,authorizeAdmin, getAdminProfile);
router.get('/admin/users', verifyJWT,authorizeAdmin, getAllUsers);
router.post("/admin/profiles",verifyJWT, authorizeAdmin, getUsersByIds);
router.get("/admin/usersList", verifyJWT, authorizeAdmin, getAllUsersExceptAdmin);
router.delete("/admin/deleteUser", verifyJWT, authorizeAdmin, deleteUser);
router.get("/admin/deletedUsersList", verifyJWT, authorizeAdmin, getDeletedUsers);
router.put("/admin/updateUserRole/:userId", verifyJWT, authorizeAdmin, updateUsersRole);
router.get("/admin/getContent/:id", verifyJWT, authorizeAdmin, getContent);
router.post("/admin/retrieve", verifyJWT, authorizeAdmin, retrieveUser);
//---------------ADMIN CONTENT ---------------

router.put('/admin/reviewPost', verifyJWT, authorizeAdmin, reviewPost);
router.get('/admin/posts', verifyJWT, authorizeAdmin, getPosts);
router.get('/admin/videos', verifyJWT,authorizeAdmin, getVideos);



export default router;