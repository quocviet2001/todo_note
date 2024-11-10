const mongoose = require('mongoose');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Task = new Schema({
  title: { type: String, require: true},
  description: { type: String, require: true },
  priority: { type: String, require: true },
  tagId: { type: Schema.Types.ObjectId, ref: 'Tag', default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  completedAt: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  status: { type: String, default: 'Chưa hoàn thành' },
  isCompleted: { type: Boolean, default: false },
  slug: { type: String, unique: true },
}, {
  timestamps: true,
});

Task.pre('save', function (next) {
  if (this.title) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    const uniqueId = uuidv4();
    this.slug = `${baseSlug}-${uniqueId}`;
  }
  next();
});

//Add Plugin : soft delete
Task.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deletedAt: true,
});

//Custom query helpers
Task.query.sortable = function (req) {
  if (req.query.hasOwnProperty('_sort')) {
    const isValidType = ['asc', 'desc'].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? req.query.type : 'desc',
    })
  }
  return this;
};

module.exports = mongoose.model('Task', Task);
