import {sql} from './database-connect.js';

export class Database {
    //retornar todos os usuários do banco
    async getUsers() {
        const users = await sql`select * from users`;
        return users;
    }

    //retornar usuário 
    async getUsersById(id_user) {
        const users_with_id = await sql `select name, photo, email from users where id_user = ${id_user}`;
        return users_with_id;
    }

    async updatePassword(email, password) {
        await sql `update users set password = ${password} where email = ${email}`;
    }

    async create(user) {
        await sql `insert into users (name, email, password, photo) values (${user.name}, ${user.email}, ${user.password}, ${user.photo})`;	
    }

    async updateUser(name, email, password) {
        await sql `update users set name = ${name}, password = ${password} where email = ${email}`;
    }

    async createPost(post) {
        await sql `insert into posts (id_user, content, timepost, nameBook, image_post) values (${post.idUser}, ${post.content}, ${post.timePost}, ${post.nameBook}, ${post.imageBook})`;
    }

    async createReview(review) {
        await sql `insert into reviews (id_user, title, content, nameBook, rating, image_post, timepost) values (${review.idUser},${review.title}, ${review.content}, ${review.nameBook}, ${review.rating}, ${review.imageBook}, ${review.timePost})`;
    }

    async getUsersPosts(init) {
        const users_and_posts = await sql `select posts.*, users.name, users.photo
        from posts inner join users using(id_user)
        limit 5 offset ${init}`;

        return users_and_posts;
    }

    async getUsersReviews(init) {
        const users_and_reviews= await sql `select reviews.*, users.name, users.photo
        from reviews inner join users using(id_user)
        limit 5 offset ${init}`;

        return users_and_reviews;
    }

    async getBookReviews(titleBook) {
        const reviews = await sql `select reviews.*, users.name, users.photo 
        from reviews inner join users using(id_user) 
        where nameBook = ${titleBook}`;
        return reviews;
    }

    async createComment (comments) {
        await sql `insert into comment (id_user, id_publication, content_comment) 
        values (${comments.idUser}, ${comments.idPublication}, ${comments.comment})`;
    }

    async getMyPosts(email) {
        const myPosts = await sql `select posts.*, users.name, users.photo 
        from posts inner join users using(id_user)
        where users.email = ${email}`;

        return myPosts;
    }

    async getMyReviews(email) {
        const myReviews = await sql `select reviews.*, users.name, users.photo
        from reviews inner join users using(id_user) 
        where users.email = ${email}`;

        return myReviews; 
    }

    async getUserOwnerInfo() {
        const ownerBook = await sql `select interests.*, users.email, users.name, books.title
        from interests 
        inner join books on interests.id_book_interest = books.id_book
        inner join users on interests.id_user_owner = users.id_user`

        return ownerBook;
    }

    async getReceiverBookInfo() {
        const receiverBook = await sql `select interests.*, users.email, users.name, books.title
        from interests
        inner join books on interests.id_mybook = books.id_book
        inner join users on interests.id_user_receiver = users.id_user`;

        return receiverBook;
    }

    async createBook(id_user, imageBook, titleBook, writerBook, ratingBook, bookReview) {
        console.log('aaaa')
        await sql `insert into books (id_user, title, writer, review, rating, cover, totalRatings, sumRatings) values (
        ${id_user}, ${titleBook}, ${writerBook}, ${bookReview}, ${ratingBook}, ${imageBook}, 1, ${ratingBook})`;
    }

    async getBooks() {
        const books = await sql `select * from books`;
        return books;
    }

    async getBookByImage(imageBook) {
        const book = await sql `select * from books where cover = ${imageBook}`;
        return book;
    }

    async updateBook(imageBook, totalRatings, sumRatings, rating) {
        await sql `update books set totalRatings = ${totalRatings}, sumRatings = ${sumRatings}, rating = ${rating} where cover = ${imageBook}`;
    }

    async setInterest(id_user, titleBook, imageBook, writerBook) {
        await sql `insert into interests (id_user, titlebook, imagebook, writerbook) values (${id_user}, ${titleBook}, ${imageBook}, ${writerBook})`;
    }

    async getInterests() {
        const interests = await sql `select * from interests`;
        return interests;
    }

    async getMyInterests(email) {
        const myInterests = await sql `select interests.titlebook, interests.imagebook, interests.writerbook, books.review 
        from interests inner join users using(id_user)
        inner join books on books.cover = interests.imagebook
        where users.email = ${email}`;

        return myInterests;
    }

    async setMyExchanges(id_user, titleBook, imageBook, writerBook) {
        await sql `insert into myExchanges (id_user, titlebook, imagebook, writerbook) values (${id_user}, ${titleBook}, ${imageBook}, ${writerBook})`;
    }

    async getMyExchanges() {
        const myExchanges = await sql `select * from myExchanges`;
        return myExchanges;
    }

    async myExchangesByEmail(email) {
        const myExchangesByEmail = await sql `select myExchanges.* from myExchanges inner join users using(id_user) where users.email = ${email}`

        return myExchangesByEmail;
    }
    async getloadComments(idPublication) {
        const comments = await sql `
        SELECT comment.*, users.name, users.photo 
        FROM comment inner join users using(id_user) 
        WHERE id_publication = ${idPublication} 
        ORDER BY id_comment ASC`;

        return comments;
    }
}
