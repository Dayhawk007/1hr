import mongoose from "mongoose";
import faker from 'faker'
import Application from "../models/application.js";

mongoose.connect('mongodb://127.0.0.1:27017/ats', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const populateApplications = async () => {
    const clientId = new mongoose.Types.ObjectId('66c75139bea6ec518317fe4b');
    const jobId = new mongoose.Types.ObjectId('66d300149cff514935e1b722');
  
    const applications = [];


    const totalExperience = faker.random.number({ min: 1, max: 20 });
  
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
        status: faker.random.arrayElement(['pre-screen', 'screen', 'pre-interview' ,'round 1', 'round 2', 'round 3', 'hired', 'rejected']),
        currentCTC: faker.random.number({ min: 500000, max: 1000000 }),
        expectedCTC: faker.random.number({ min: 1000000, max: 2000000 }),
        totalExperience: totalExperience,
        relevantExperience: faker.random.number({ min: 1, max: totalExperience }),
        noticePeriod: faker.random.arrayElement(['immediate', '1-2 weeks', '2-4 weeks', '1 month','2 months','3 months']),
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