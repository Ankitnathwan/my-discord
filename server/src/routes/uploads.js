const express = require("express")
const streamifier = require("streamifier")
const cloudinary = require("../config/cloudinary")
const upload = require("../middleware/upload")
const { authenticate } = require("../middleware/authenticate")

const router = express.Router();
router.use(authenticate);

router.post("/image", upload.single("image"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "discord-clone",
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                }

                return res.json({
                    url: result.secure_url,
                });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;