const router = require('express').Router();
const Program = require('../../models/Program');
const Partner = require('../../models/Partner');
const Sport = require('../../models/Sport');
const Attachment = require('../../models/Attachment');
const auth = require('../auth');
const {getNotNullFields, getFileName} = require('../../utils');
const {upload, getImageName} = require('../../config-api/storage');
const s3 = require('../../config-api/s3');
const mongoose = require('mongoose');




const create = async (req, res, next) => {
  try {
    const {
      address, 
      phone, 
      mail,
      title, 
      image, 
      banner, 
      logo, 
      video, 
      attachments,
      description,
      sports,
    } = req.body;
    const partner = new Partner({
      address, 
      phone, 
      mail,
      title, 
      image, 
      banner, 
      logo, 
      video, 
      attachments,
      description,
      sports,
    });
    await partner.save();
    await Sport.updateOne({_id: {$in: sports}}, {$push: {partners: partner._id}});
    res.status(200).json(partner);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const data = await Promise.all([
      Partner.findOne({_id: req.params.id})
      .populate('attachments', 'type , src , name , size')
      .populate('sports')
        //.populate('coachs')
        .populate('company')
        .populate({path: 'coachs', populate: [
          {path: 'user', select: {firstName: 1, lastName: 1, avatar: 1}},
        ]}),
    ]);
    res.status(200).json({...data[0].toJSON()});
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const {
      address, 
      phone, 
      mail,
      title, 
      image, 
      banner, 
      logo, 
      video, 
      attachments,
      description,
      sports,
    } = req.body;
    const data = getNotNullFields({
      address, 
      phone, 
      mail,
      title, 
      image, 
      banner, 
      logo, 
      video, 
      attachments,
      description,
      sports,
    });
    const partner = await Partner.findOneAndUpdate(
      {_id: req.params.id},
      {$set: data},
      {new: true}
    );
    res.status(200).json(partner);
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

const register = async (req, res, next) => {
  try {
    const partnerId = req.params.id
    const userId = req.body.id

    await Promise.all([
      Partner.updateOne({_id: partnerId}, {$push: {coachs: userId}}),
      User.updateOne({_id: userId}, {$set: {partner: partnerId}})
    ]);

    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};

const unregister = async (req, res, next) => {
  try {
    const partnerId = req.params.id
    const userId = req.body.id

    await Promise.all([
      Partner.updateOne({_id: partnerId}, {$pull: {coachs: userId}}),
      User.updateOne({_id: userId}, {$set: {partner: null}})
    ]);

    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};


const remove = async (req, res, next) => {
  try {
    const partners = await Partner.find({_id: {$in: req.body.partners}});
    const attachments = partners.map(partner => partner.attachments).flat();
    await Partner.deleteMany({_id: {$in: req.body.partners}});
    await Promise.all([
      Sport.updateOne({partners: {$in: req.body.partners}}, {$pull: {partners: {$in: req.body.partners}}}),
      Attachment.deleteMany({_id: {$in: attachments}}),
      User.updateMany({partner: req.body.partners?.[0]}, {$set: {partner: null}}),
    ]);
    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};

router.post("/", auth.required, create);
router.get("/:id", auth.required, get);
router.put("/:id", auth.required, update);
router.put("/register/:id", auth.required, register);
router.put("/unregister/:id", auth.required, unregister);
router.put("/:id/file", [auth.required, upload.array('file')], uploadFiles);
router.delete("/:id/file/:file", auth.required, removeAttachment);
router.put("/delete/programs", auth.required, remove);

module.exports = router;
