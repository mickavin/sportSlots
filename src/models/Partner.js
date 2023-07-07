const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
  address: {type: String, default: ''},
  phone: {type: String, default: ''},
  mail: {type: String, default: ''},
  title: {type: String, required: true},
  image: {type: String, default: ''},
  banner: {type: String, default: ''},
  logo: {type: String, default: ''},
  video: {type: String, default: ''},
  attachments: {type: [{type: mongoose.Types.ObjectId, ref: 'Attachment'}], default: undefined},
  description: {type: String, required: true},
  coachs: {type:[{type: mongoose.Types.ObjectId, ref: 'User'}], default: undefined},
  sports: {type:[{type: mongoose.Types.ObjectId, ref: 'Sport'}], default: undefined},
});

module.exports = mongoose.model('Partner', PartnerSchema);
