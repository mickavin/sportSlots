const mongoose = require("mongoose");

const SportSchema = new mongoose.Schema({
  title: {type: String, required: true},
  image: {type: String, default: ''},
  banner: {type: String, default: ''},
  logo: {type: String, default: ''},
  video: {type: String, default: ''},
  color: {type: String, default: ''},
  localIcon: {type: Number, default: null},
  attachments: {type: [{type: mongoose.Types.ObjectId, ref: 'Attachment'}], default: undefined},
  description: {type: String, required: true},
  coachs: {type:[{type: mongoose.Types.ObjectId, ref: 'User'}], default: undefined},
  partners: {type:[{type: mongoose.Types.ObjectId, ref: 'Partner'}], default: undefined},
  programs: {type:[{type: mongoose.Types.ObjectId, ref: 'Program'}], default: undefined},
});

module.exports = mongoose.model('Sport', SportSchema);
