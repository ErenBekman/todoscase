const router = require("express").Router();
const httpStatus = require("http-status");
const { Todo, User } = require("../../models");
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fs = require('fs');
const path = require('path');
let {
    auth,
    validate: { body, express_validate },
} = require("../../middleware");


router.get("/", auth(), (req, res) => {
    const { search, searchTags } = req.query;
    let where = { user: req.user._id };
    if (search) {
        where.text = { $regex: search, $options: "i" };
    }
    if (searchTags) {
        where.tags = { $in: searchTags };
        // where = {
        //     ...where,
        //     tags: { $in: searchTags.split(",") }
        // }
    }

    Todo.find(where, { user: 0 }, { sort: { createdAt: -1 } })
    .then((todos) => {
        res.status(httpStatus.OK).json(
            {
                data: todos.map((todo) => {
                    return {
                        ...todo._doc,
                        image: todo.image ? `http://localhost:8080/media/${todo.image}` : null,
                        file: todo.file ? `http://localhost:8080/media/${todo.file}` : null,
                    };
                })
            }
        );
    });
});

router.post("/", auth(), body("text").isString(), body("tags").isArray().optional(), express_validate, (req, res) => {
    let { text, tags } = req.body;

    let todo = new Todo({
        user: req.user._id,
        text,
        tags,
        isCompleted: false,
    });

    todo.save()
    .then((todo) => {
        res.status(httpStatus.CREATED).json(todo);
    }).catch((error) => {
        res.status(httpStatus.BAD_REQUEST).json(error);
    });
});

router.put("/:id", 
    auth(), 
    body("text").isString().optional(), 
    body("tags").isArray().optional(), 
    body("isCompleted").isBoolean().optional(), 
    upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
    express_validate, 
(req, res) => {
    let { text, tags, isCompleted } = req.body;
    let { id } = req.params;
    const user_id = req.user._id;
    const files = req.files;

    if(tags && typeof tags === 'string') {
        tags = tags.split(",");
    }

    if(!id) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Todo id is required" });
    }

    let file_name = undefined;
    let image_name = undefined;
    
    if (files?.file) {
        file_name = files.file[0].originalname;
        const file_path = path.join(__dirname, "../../public/media", file_name);
        fs.writeFileSync(file_path, files.file[0].buffer);
    } 
    if (files?.image) {
        image_name = files.image[0].originalname;
        const file_path = path.join(__dirname, "../../public/media", image_name);
        fs.writeFileSync(file_path, files.image[0].buffer);
    }
    
    Todo.findOneAndUpdate({ _id: id, user: user_id }, { text, tags, isCompleted, file: file_name, image: image_name }, { new: true })
    .then((todo) => {
        if (!todo) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Todo not found" });
        }

        res.status(httpStatus.OK).json(todo);
    });

});

router.delete("/:id", auth(), (req, res) => {
    if (!req.params.id) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Todo id is required" });
    }
    Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    .then((todo) => {
        if (!todo) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Todo not found" });
        }

        res.status(httpStatus.OK).json(todo);
    });
});


module.exports = router;

