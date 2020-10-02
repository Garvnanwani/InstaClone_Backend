const errorHandler = ((err, req, res, next) => {

    console.log(err.message);

    if (!err.statusCode) {
        err.statusCode = 500;
    }

    if (err.code === 11000) {
        err.message = "Duplicate key";

        if (err.keyValue.email) {
            err.message = "The email is already taken";
        }

        if (err.keyValue.username) {
            err.message = "The username is already taken";
        }

        err.statusCode = 400;
    }

    if (err.name === "ValidationError") {
        const fields = Object.keys(err.errors);

        fields.map((field) => {
            if (err.errors[field].kind === "maxlength") {
                err.message = "Password should be maximum of 12 characters";
            } else {
                err.message = "Password should be minimum of 6 characters";
            }
        });

        err.statusCode = 400;
    }


    if (err.name === "CastError") {
        err.message = "The ObjectID is malformed";
        err.statusCode = 400;
    }

    if (err.name === 'MulterError') {
        if (err.message === 'File too large') {
            return res
                .status(400)
                .send({ error: 'Your file exceeds the limit of 10MB.' });
        }
    }

    res.status(err.statusCode).json({
        success: false, message: err.statusCode >= 500 ? 'An unexpected error occurred, please try again later.' : err.message,
    })

})

module.exports = errorHandler;
