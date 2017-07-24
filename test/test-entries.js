const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {Entry} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedEntryData() {
  console.info('seeding entry data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateEntryData());
  }
  return Entry.insertMany(seedData);
}

function generateEntryData() {
  return {
    charity: faker.company.companyName(),
    amount: faker.commerce.price(),
    type: faker.lorem.words(),
    url: faker.internet.domainName()
  }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('index page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe('Entries API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedEntryData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

  describe('GET endpoint', function() {

    it('should return all existing entries', function() {
      let res;
      return chai.request(app)
        .get('/entries')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.entries.should.have.length.of.at.least(1);
          return Entry.count();
        })
        .then(function(count) {
          res.body.entries.should.have.lengthOf(count);
        });
    });


    it('should return entries with right fields', function() {

      let resEntry;
      return chai.request(app)
        .get('/entries')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.entries.should.be.a('array');
          res.body.entries.should.have.length.of.at.least(1);

          res.body.entries.forEach(function(entry) {
            entry.should.be.a('object');
            entry.should.include.keys(
              'id', 'charity', 'amount', 'type', 'url');
          });
          resEntry = res.body.entries[0];
          return Entry.findById(resEntry.id);
        })
        .then(function(entry) {

          resEntry.id.should.equal(entry.id);
          resEntry.charity.should.equal(entry.charity);
          resEntry.amount.should.equal(entry.amount);
          resEntry.type.should.equal(entry.type);
          resEntry.url.should.equal(entry.url);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new entry', function() {

      const newEntry = generateEntryData();

      return chai.request(app)
        .post('/entries')
        .send(newEntry)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'charity', 'amount', 'type', 'url');
          res.body.charity.should.equal(newEntry.charity);
          res.body.id.should.not.be.null;
          res.body.amount.should.equal(newEntry.amount);
          res.body.type.should.equal(newEntry.type);
          res.body.url.should.equal(newEntry.url);

          return Entry.findById(res.body.id);
        })
        .then(function(entry) {
          entry.charity.should.equal(newEntry.charity);
          entry.amount.should.equal(newEntry.amount);
          entry.type.should.equal(newEntry.type);
          entry.url.should.equal(newEntry.url);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        charity: '',
        amount: '',
        type: '',
        url: '',
      };

      return Entry
        .findOne()
        .exec()
        .then(function(entry) {
          updateData.id = entry.id;

          return chai.request(app)
            .put(`/entries/${entry.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(201);

          return Entry.findById(updateData.id).exec();
        })
        .then(function(entry) {
          entry.charity.should.equal(updateData.charity);
          entry.amount.should.equal(updateData.amount);
          entry.type.should.equal(updateData.type);
          entry.url.should.equal(updateData.url);
        });
      });
  });

  describe('DELETE endpoint', function() {
    it('delete an entry by id', function() {

      let entry;

      return Entry
        .findOne()
        .exec()
        .then(function(_entry) {
          entry = _entry;
          return chai.request(app).delete(`/entries/${entry.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Entry.findById(entry.id).exec();
        })
        .then(function(_entry) {
          should.not.exist(_entry );
        });
    });
  });
});
