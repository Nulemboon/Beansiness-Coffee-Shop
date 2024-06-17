const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tri2003714:8825529tT@cluster0.tq9x0ib.mongodb.net/')
.then(async () => {
  console.log('Connected to MongoDB');

  await mongoose.connection.db.dropCollection('test'); // Replace with your collection name
  console.log('Collection dropped');

  mongoose.connection.close();
}).catch(err => {
  console.error('Error dropping collection:', err);
  mongoose.connection.close();
});
