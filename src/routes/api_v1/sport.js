const router = require('express').Router();
const User = require('../../models/User');
const Sport = require('../../models/Sport');
const Partner = require('../../models/Partner');
const Program = require('../../models/Program');
const auth = require('../auth');
const {getNotNullFields} = require('../../utils');
const {upload, getImageName} = require('../../config-api/storage');
const s3 = require('../../config-api/s3');

const create = async (req, res, next) => {
  try {
    const {
      title,
      image,
      banner,
      logo,
      video,
      attachments,
      description,
      color,
      localIcon
    } = req.body;
    const sport = new Sport({
      title,
      image,
      banner,
      logo,
      video,
      attachments,
      description,
      color,
      localIcon
    });
    await sport.save();
    res.status(200).json(sport);
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const sports = await Sport.find()
    res.status(200).json(sports);
  } catch (e) {
    next(e);
  }
};

const getAllForFilter = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.params.id})
    const date = new Date()
    date.setDate(date.getDate()-2);
    let sports = await Sport.find({startDate: {$gt: date}})
    .populate({path: 'coachs', populate: [
      {path: 'user', select: {firstName: 1, lastName: 1, avatar: 1}},
    ]})
    .populate({path: 'programs', 
    match: { companies: {$in: user?.company}},
    populate: [
      {
        path: 'coach', 
        select: {password: 0},
      },
      {
        path: 'registered', 
        select: {password: 0},
      },
      {
        path: 'sport'
      },
    ]})

    sports = sports.filter((sport) => sport?.programs?.length)
    res.status(200).json(sports);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const data = await Sport.findOne({_id: req.params.id})
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const uploadFiles = async (req, res, next) => {
  try {
    const requests = [];
    const newReq = [];
    for (const file of req.files) {
      requests.push(s3.upload(file, 'attachment', getImageName(file)));
    }
    const uploadedFiles = await Promise.all(requests);
    uploadedFiles.forEach((file, index) => {
      const {mimetype, size, filename} = req.files[index];
      newReq.push((new Attachment({src: file.key, type: mimetype, size, name: getFileName(filename)})).save())
    });
    const savedAttachments = await Promise.all(newReq);
    await Partner.updateOne(
      {_id: req.params.id},
      {$push: {attachments: savedAttachments.map(a => a._id)}},
    );
    res.status(200).json({partner: req.params.id, uploadedAttachments: savedAttachments});
  } catch (e) {
    next(e);
  }
};

const removeAttachment = async (req, res, next) => {
  try {
    const file = await Attachment.findOne({_id: req.params.file}, {src: 1});
    await Promise.all([
      Partner.updateOne({_id: req.params.id}, {$pull: {attachments: req.params.file}}),
      Attachment.deleteOne({_id: req.params.file}),
      s3.remove(file.src)
    ]);
    res.send({deletedFile: file._id});
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const {
      title,
      image,
      banner,
      logo,
      video,
      attachments,
      description,
      color,
      localIcon
    } = req.body;
    const data = getNotNullFields({
      title,
      image,
      banner,
      logo,
      video,
      attachments,
      description,
      color,
      localIcon
    })
    const sport = await Sport.findOneAndUpdate({_id: req.params.id}, {$set: data});
    res.status(200).json(sport);
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await Promise.all([
      Sport.deleteOne({_id: req.params.id}),
      User.updateMany({sports: {$in: [req.params.id]}}, {$pull: {sports: {$in: [req.params.id]}}}),
      Partner.updateMany({sports: {$in: [req.params.id]}}, {$pull: {sports: {$in: [req.params.id]}}}),
      User.updateMany({favorites: {$in: [req.params.id]}}, {$pull: {favorites: {$in: [req.params.id]}}}),
      Program.updateMany({sport: {$eq: req.params.id}}, {$pull: {sport: {$eq: req.params.id}}}),
    ]);
    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const uploaded = await s3.upload(req.file, 'images', getImageName(req.file));
    res.status(200).json({path: uploaded.key});
  } catch (e) {
    next(e);
  }
};

router.post("/", auth.required, create);
router.get("/", auth.required, getAll);
router.get("/getAllForFilter/:id", auth.required, getAllForFilter);
router.post("/image", [auth.required, upload.single('image')], uploadImage);
router.put("/image", [auth.required, upload.single('image')], uploadImage);
router.put("/:id", auth.required, update);
router.delete("/:id", auth.required, remove);
router.get("/:id", auth.required, get);



module.exports = router;
