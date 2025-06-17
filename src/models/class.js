const classSchema = new mongoose.Schema({
  className: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Class', classSchema);
