import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/img/products");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const storageCategory = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/img/categories");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

export const uploadCategory = multer({
    storage: storageCategory,
});

const upload = multer({
    storage: storage,
});

export default upload;