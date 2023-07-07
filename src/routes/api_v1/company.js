const router = require('express').Router();
const Partner = require('../../models/Partner');
const User = require('../../models/User');
const Attachment = require('../../models/Attachment');
const Company = require('../../models/Company');
const auth = require('../auth');
const {getNotNullFields, getFileName} = require('../../utils');
const {upload, getImageName} = require('../../config-api/storage');
const s3 = require('../../config-api/s3');
const mongoose = require('mongoose');
const {ErrorHandler} = require('../../config-api/error');



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
      visible
    } = req.body;
    let code = Math.random().toString(36).slice(2).toUpperCase()
    let alreadyHave = await Company.findOne({code: code.toUpperCase()});
    if (alreadyHave) {
      while (alreadyHave){
        code = Math.random().toString(36).slice(2)
        alreadyHave = await Company.findOne({code: code.toUpperCase()})
      }
    }

    const company = new Company({
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
      visible,
      code
    });
    await company.save();
    res.status(200).json(company);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const data = await Promise.all([
      Company.findOne({_id: req.params.id})
      .populate('attachments', 'type , src , name , size')
      .populate('employees', 'firstName , lastName , avatar , email')  
    ]);
    res.status(200).json({...data[0].toJSON()});
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const data = await Company.find();
    res.status(200).json(data);
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
      visible
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
      visible
    });
    const company = await Company.findOneAndUpdate(
      {_id: req.params.id},
      {$set: data},
      {new: true}
    );
    res.status(200).json(company);
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
    await Company.updateOne(
      {_id: req.params.id},
      {$push: {attachments: savedAttachments.map(a => a._id)}},
    );
    res.status(200).json({company: req.params.id, uploadedAttachments: savedAttachments});
  } catch (e) {
    next(e);
  }
};

const removeAttachment = async (req, res, next) => {
  try {
    const file = await Attachment.findOne({_id: req.params.file}, {src: 1});
    await Promise.all([
      Company.updateOne({_id: req.params.id}, {$pull: {attachments: req.params.file}}),
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
    // const companyId = req.body.companyId
    const code = req.body.code.toUpperCase().trim()
    const userId = req.body.id

    const company = await Company.findOne({code})
    if(!company){
      return new ErrorHandler(404, `L'entreprise associé à ce code n'a pas été trouvée.`, [], res);
    }
    await Promise.all([
      Company.updateOne({code}, {$push: {employees: userId}}),
      User.updateOne({_id: userId}, {$set: {company: company._id}})
    ]);
    const user = await User.findOne({_id: userId}, {password: 0})
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

const unregister = async (req, res, next) => {
  try {
    const companyId = req.body.companyId
    const userId = req.body.id

    await Promise.all([
      Company.updateOne({_id: companyId}, {$pull: {employees: userId}}),
      User.updateOne({_id: userId}, {$set: {company: null}})
    ]);

    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};


const remove = async (req, res, next) => {
  try {
    const companies = [req.params.id]
    const companiesArray = await Company.find({_id: {$in: req.params.id}});
    const attachments = companiesArray.map(company => company.attachments).flat();
    await Company.deleteMany({_id: {$in: companies}});
    await Promise.all([
      Company.updateOne({companies: {$in: companies}}, {$pull: {companies: {$in: companies}}}),
      Attachment.deleteMany({_id: {$in: attachments}}),
      User.updateMany({company: companies?.[0]}, {$set: {company: null}}),
    ]);
    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};

router.post("/", auth.required, create);
router.get("/getAll", auth.required, getAll);
router.put("/register", auth.required, register);
router.put("/unregister", auth.required, unregister);
router.get("/:id", auth.required, get);
router.put("/:id", auth.required, update);
router.put("/:id/file", [auth.required, upload.array('file')], uploadFiles);
router.delete("/:id/file/:file", auth.required, removeAttachment);
router.delete("/:id", auth.required, remove);

module.exports = router;
