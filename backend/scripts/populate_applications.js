import mongoose from "mongoose";
import faker from 'faker'
import Application from "../models/application";

mongoose.connect('mongodb://127.0.0.1:27017/ats', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const populateApplications = async () => {
    const clientId = mongoose.Types.ObjectId('66bb61ef51a3b57428dda516');
    const jobId = mongoose.Types.ObjectId('66bb62c451a3b57428dda542');
  
    const applications = [];
  
    for (let i = 0; i < 10; i++) { // Change 10 to the number of documents you want to create
      const application = new Application({
        client: clientId,
        job: jobId,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
        pincode: faker.address.zipCode(),
        resumeUrl: faker.internet.url(),
        status: faker.random.arrayElement(['pre-screen', 'screen', 'interviewing', 'hired', 'rejected']),
        createdAt: faker.date.recent(),
      });
  
      applications.push(application);
    }
  
    await Application.insertMany(applications);
    console.log('Applications have been populated!');
  };
  
  populateApplications().then(() => {
    mongoose.connection.close();
  });