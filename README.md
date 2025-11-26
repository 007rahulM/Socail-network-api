# **🌐 Social Network API**

A full-featured Social Network Backend built with Node.js, Express, and MongoDB. Features include a smart news feed algorithm, image uploads, and relationship management.

**Live Demo:** https://socail-net-site-api.onrender.com

##  **Key Features**

*  **Authentication:** Secure Register/Login with **JWT** & **BCrypt**.  
*  **Social Graph:** Follow/Unfollow system with efficient data modeling.  
*  **Smart Feed:** Aggregates posts from followed users, sorted by time.  
*  **Media Support:** Image uploads using **Multer** and **Cloudinary**.  
*  **Performance:** Implemented **Pagination** to handle large data loads.  
*  **Interaction:** Like (toggle) and Comment on posts.

##  **Tech Stack**

* **Core:** Node.js, Express.js  
* **Database:** MongoDB Atlas (Schema Design, Indexing)  
* **Storage:** Cloudinary (Image Hosting)  
* **Tools:** Postman, Git, Render

##  **API Endpoints**

### **1\. Auth & Users**

| Method | Endpoint | Description | Auth? |
| :---- | :---- | :---- | :---- |
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login & Get Token | No |
| GET | /api/users/:username | View User Profile | No |
| PUT | /api/users/follow/:id | Follow/Unfollow User | **Yes** |

### **2\. Posts & Feed**

| Method | Endpoint | Description | Auth? |
| :---- | :---- | :---- | :---- |
| POST | /api/posts | Create Post (Text \+ Img URL) | **Yes** |
| GET | /api/posts/newposts/all | **News Feed** (Paginated) | **Yes** |
| DELETE | /api/posts/:id | Delete own post | **Yes** |

### **3\. Interactions**

| Method | Endpoint | Description | Auth? |
| :---- | :---- | :---- | :---- |
| PUT | /api/posts/like/:id | Like/Unlike Post | **Yes** |
| PUT | /api/posts/comment/:id | Add Comment | **Yes** |

### **4\. Uploads**

| Method | Endpoint | Description | Auth? |
| :---- | :---- | :---- | :---- |
| POST | /api/upload | Upload Image \-\> Get URL | No |

##  **Complex Logic Explained**

### **The Feed Algorithm (/newposts/all)**

Instead of fetching all posts, the API:

1. Finds the current user's following array.  
2. Uses the MongoDB $in operator to find posts ONLY from those users.  
3. Applies .sort({ createdAt: \-1 }) for chronological order.  
4. Uses .skip() and .limit() for efficient **Pagination**.

### **Image Upload Pipeline**

Images are **not** stored in the database.

1. **Multer** intercepts the file in RAM.  
2. Stream uploads to **Cloudinary**.  
3. Cloudinary returns a URL.  
4. **MongoDB** stores only the URL string.
