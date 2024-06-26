export class Controller {
    constructor(database, user) {
        this.database = database;
        this.user = user;
    }

    async userExists(email) {
        return await this.database.getUsers().then(users => {
        const userWithEmail = users.find(user => {
            return user.email === email;
        });
    
        return userWithEmail;
        });
    }

    async getPosts(contPost) {
        const posts = await this.database.getUsersPosts(contPost).then((posts) => {
            return posts;
        }); 

        return posts;
    }

    async getReviews(contReview) {
        const reviews = await this.database.getUsersReviews(contReview).then((reviews) => {
            return reviews;
        });

        return reviews;
    }

    changeDateFormat(publications) {
        publications.forEach((publication) => {
            if(publication.timepost.includes('PM') || publication.timepost.includes('AM')) {
                let [date, time] = publication.timepost.split(', ');
                const [month, day, year] = date.split('/');

                const [timePart, amOrPm] = time.split(' ');
                let [hours, minutes, seconds] = timePart.split(':');

                if(amOrPm === 'PM' && hours < 12) {
                    hours = parseInt(hours) +12;
        
                }else if(amOrPm === 'AM' && hours === '12') {
                    hours = 0;
                }

                time = `${hours}:${minutes}:${seconds}`;

                publication.timepost = `${day}/${month}/${year}, ${time}`
            }
        })

        return publications
    }

    sortPublications(publications) {
        publications.sort((a, b) => {
            return new Date(b.timepost.split(', ')[0].split('/').reverse().join('-')) - new Date(a.timepost.split(', ')[0].split('/').reverse().join('-'));
        })
    }

    async getUserByEmail(email) {
        if(email !== null) {
            const user = await this.userExists(email);

            return user.id_user;
        }
    }

    async bookExists(imageBook) {
        const books = await this.database.getBooks();

        if(books.find((book) => book.cover === imageBook)) {
            return true;
        }

        return false;
    }
}