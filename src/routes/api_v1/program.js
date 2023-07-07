const router = require('express').Router();
const Project = require('../../models/Project');
const Program = require('../../models/Program');
const Sport = require('../../models/Sport');
const Attachment = require('../../models/Attachment');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const auth = require('../auth');
const {getNotNullFields, getFileName} = require('../../utils');
const {upload, getImageName} = require('../../config-api/storage');
const s3 = require('../../config-api/s3');
const mongoose = require('mongoose');
const {ErrorHandler} = require('../../config-api/error');

const create = async (req, res, next) => {
  try {
    const {
      title, 
      startDate, 
      endDate,
      sport, 
      image, 
      description, 
      active = false, 
      archived = false, 
      willTakePlace = false, 
      companies = null, 
      coach = null,
      tags,
      registered = null,
      attachments,
      slots,
      mail,
      contact,
      address,
      longitude,
      latitude
    } = req.body;
    const program = new Program(getNotNullFields({
      title, 
      startDate, 
      endDate, 
      sport, 
      image, 
      description, 
      active, 
      willTakePlace, 
      companies, 
      tags,
      archived,
      coach,
      slots,
      attachments,
      registered,
      mail,
      contact,
      address,
      longitude,
      latitude,
      ...(!coach ? {createdBy: registered?.[0]} : {})
    }));
    await program.save();
    if(coach){
      await User.updateOne({_id: coach}, {$push: {programsToDeliver: program._id, history: {title: `"${title.substring(0, 10)}" a été crée.`}}});
    }
    await Sport.updateOne({_id: sport}, {$push: {programs: program._id}});
    res.status(200).json(program);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const data = await Promise.all([
      Program.findOne({_id: req.params.id}).populate('attachments')
        .populate('sport')
        .populate('companies')
        .populate('coach')
        .populate('attachments', 'type , src , name , size')
        .populate({path: 'comments', populate: [
          {path: 'user', select: {firstName: 1, lastName: 1, avatar: 1}},
          {path: 'attachments', select: {src: 1, type: 1, name: 1, size: 1}},
        ]})
        .populate('coach', 'firstName , lastName , email')
        .populate('registered', 'firstName , lastName , email'),
    ]);
    res.status(200).json({...data[0].toJSON()});
  } catch (e) {
    next(e);
  }
};

const getUserPrograms = async (req, res, next) => {
  try {
    const data = await User.findOne({_id: req.params.id})
    .populate({path: 'programs', populate: [
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
    res.status(200).json(data?.programs || []);
  } catch (e) {
    next(e);
  }
};

const getProgramForEdit = async (req, res, next) => {
  try {
    const data = await Promise.all([
      Program.findOne({_id: req.params.id}).populate('attachments')
        .populate('attachments', 'type , src , name , size')
        .populate({path: 'comments', populate: [
          {path: 'user', select: {firstName: 1, lastName: 1, avatar: 1}},
          {path: 'attachments', select: {src: 1, type: 1, name: 1, size: 1}},
        ]})
    ]);
    res.status(200).json({...data[0].toJSON()});
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const {id} = req.params
    const user = await User.findById(id)
    if (!user) new ErrorHandler(404, `Votre compte n'a pas été trouvé.`, [], res);
    let programs = []
    if(user.role === 3) {
      programs = await Program.find({createdBy: id})        
      .populate('coach')
      .populate('sport')

    } else if(user.role === 2) {
      programs = await Program.find({coach: id})
      .populate('coach')
      .populate('sport')
    } else if(user.role === 1) {
      programs = await Program.find()
      .populate('coach')
      .populate('sport')
    }
    res.status(200).json(programs);
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const _id = req.body.id //ObjectId
    const userId = req.body.userId //ObjectId
    const registered = req.body.registered //boolean
    const coach = req.body.coach //ObjectId
    const sport = req.body.sport //ObjectId
    const user = await User.findOne({_id: userId})
    let programs = []
    if(result?.id){
      programs = await Program.find({_id, companies: {$in: [user.company]}})
    } else {
      programs = await Program.find({
        companies: {$in: [user.company]},
        ...(registered ? {registered: {$in: [user._id]}} : {}),
        ...(coach ? {coach: {$in: [coach]}} : {}),
        ...(sport ? {sport: {$in: [sport]}} : {}),
        ...(sport ? {sport: {$in: [sport]}} : {}),
        
      })
    }
    res.status(200).json(programs);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const {
      title, 
      startDate, 
      endDate,
      //sport, 
      image, 
      description, 
      active = false, 
      archived = false, 
      willTakePlace = false, 
      companies = null, 
      coach = null,
      tags,
      registered = null,
      attachments,
      slots,
      mail,
      contact,
      address,
      longitude,
      latitude
    } = req.body;
    const data = getNotNullFields({
      title, 
      startDate, 
      endDate, 
      //sport, 
      image, 
      description, 
      active, 
      willTakePlace, 
      companies, 
      tags,
      archived,
      coach,
      slots,
      attachments,
      registered,
      mail,
      contact,
      address,
      longitude,
      latitude
    });
    // if (Array.isArray(tags) && tags.length === 0) data['tags'] = [];
    // if (Array.isArray(members)) data['members'] = members;
    const program = await Program.findOneAndUpdate(
      {_id: req.params.id},
      {$set: data},
      {new: true}
    );
    res.status(200).json(program);
  } catch (e) {
    next(e);
  }
};

const updateMultiple = async (req, res, next) => {
  try {
    const {programs} = req.body;
    const reqs = [];
    programs.map(t => t._id);
    programs.forEach(item => reqs.push(Program.updateOne({_id: item._id}, {$set: getNotNullFields(item)})));
    await Promise.all(reqs);
    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};

const duplicate = async (req, res, next) => {
  try {
    const duplicateItem = await Program.findOne({_id: req.params.id}, {comments: 0, archived: 0, _id: 0, createdAt: 0, active: 0, willTakePlace: 0, registered: 0});
    const _id = new mongoose.Types.ObjectId();
    const item = {...duplicateItem._doc, _id};
    const a = await Program.create(item);
    res.status(200).json(a);
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
    await Program.updateOne(
      {_id: req.params.id},
      {$push: {attachments: savedAttachments.map(a => a._id)}},
    );
    res.status(200).json({program: req.params.id, uploadedAttachments: savedAttachments});
  } catch (e) {
    next(e);
  }
};

const removeAttachment = async (req, res, next) => {
  try {
    const file = await Attachment.findOne({_id: req.params.file}, {src: 1});
    await Promise.all([
      Program.updateOne({_id: req.params.id}, {$pull: {attachments: req.params.file}}),
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
    const programId = req.params.id
    const userId = req.body.id

    await Promise.all([
      Program.updateOne({_id: programId}, {$push: {registered: userId}}),
      User.updateOne({_id: userId}, {$push: {programs: programId}})
    ]);

    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};

const unregister = async (req, res, next) => {
  try {
    const programId = req.params.id
    const userId = req.body.id

    await Promise.all([
      Program.updateOne({_id: programId}, {$pull: {registered: userId}}),
      User.updateOne({_id: userId}, {$pull: {programs: programId}})
    ]);

    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};


const remove = async (req, res, next) => {
  try {
    const programsIds = [req.params.id]
    const programs = await Program.find({_id: {$in: programsIds}});
    const comments = programs.map(program => program.comments).flat();
    const attachments = programs.map(program => program.attachments).flat();
    await Program.deleteMany({_id: {$in: programsIds}});
    await Promise.all([
      Sport.updateOne({programs: {$in: programsIds}}, {$pull: {programs: {$in: programsIds}}}),
      Comment.deleteMany({_id: {$in: comments}}),
      Attachment.deleteMany({_id: {$in: attachments}}),
      User.updateMany({programsToDeliver: {$in: programsIds}}, {$pull: {programsToDeliver: {$in: programsIds}}}),
      User.updateMany({programs: {$in: programsIds}}, {$pull: {programs: {$in: programsIds}}})
    ]);
    res.status(200).json({ok: 1});
  } catch (e) {
    next(e);
  }
};

router.post("/", auth.required, create);
router.get("/search", auth.required, search);
router.get("/:id", auth.required, get);
router.get("/getUserPrograms/:id", auth.required, getUserPrograms);
router.get("/getProgramForEdit/:id", auth.required, getProgramForEdit);
router.put("/:id", auth.required, update);
router.get("/getAll/:id", auth.required, getAll);
router.put("/register/:id", auth.required, register);
router.put("/unregister/:id", auth.required, unregister);
router.post("/:id/duplicate", auth.required, duplicate);
router.put("/update/multi", auth.required, updateMultiple);
router.put("/:id/file", [auth.required, upload.array('file')], uploadFiles);
router.delete("/:id/file/:file", auth.required, removeAttachment);
router.delete("/:id", auth.required, remove);

module.exports = router;
