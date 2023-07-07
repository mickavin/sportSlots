const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  code: {type: String},
  address: {type: String, default: ''},
  longitude: {type: Number},
  latitude: {type: Number},
  phone: {type: String, default: ''},
  mail: {type: String, default: ''},
  title: {type: String, required: true},
  image: {type: String, default: ''},
  banner: {type: String, default: ''},
  logo: {type: String, default: ''},
  video: {type: String, default: ''},
  attachments: {type: [{type: mongoose.Types.ObjectId, ref: 'Attachment'}], default: undefined},
  description: {type: String, required: true},
  visible: {type: Boolean, default: false},
  employees: {type:[{type: mongoose.Types.ObjectId, ref: 'User'}], default: undefined},
  history: [{title: String, createdAt: {type: Date, default: Date.now}}],
});

module.exports = mongoose.model('Company', CompanySchema);
