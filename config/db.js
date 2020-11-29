const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        console.log(`MogoDB Connected to ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
