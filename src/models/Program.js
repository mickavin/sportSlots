const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  address: {type: String, default: ''},
  longitude: {type: Number},
  latitude: {type: Number},
  contact: {type: String, default: ''},
  mail: {type: String, default: ''},
  title: {type: String, required: true},
  image: {type: String, default: ''},
  description: {type: String, required: true},
  startDate: {type: Date, default: null},
  endDate: {type: Date, default: null},
  active: Boolean,
  willTakePlace: Boolean,
  tags: {type: [{_id: String, color: String, name: String}], default: undefined},
  archived: {type: Boolean, default: false},
  coach: {type: mongoose.Types.ObjectId, ref: 'User', default: undefined},
  createdBy: {type: mongoose.Types.ObjectId, ref: 'User', default: undefined},
  attachments: {type: [{type: mongoose.Types.ObjectId, ref: 'Attachment'}], default: undefined},
  registered: {type: [{type: mongoose.Types.ObjectId, ref: 'User'}], default: undefined},
  sport: {type: mongoose.Types.ObjectId, ref: 'Sport'},
  companies: {type:[{type: mongoose.Types.ObjectId, ref: 'Company'}], default: undefined},
  createdAt: {type: Date, default: Date.now},
  comments: {type: [{type: mongoose.Types.ObjectId, ref: 'Comment'}], default: undefined},
  slots: {
    type: [{
      day: String,
      hasCourse: Boolean,
      opening: [{
        color: String,
        daysOfWeek: String
      }],
      endTime: String,
      startTime: String,
      extDate: [{
        type: String
      }],
      rrule: {
        dtstart: String,
        freq: String
      },
      title: String
    }
  ]}
});

module.exports = mongoose.model('Program', ProgramSchema);
