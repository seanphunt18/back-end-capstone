const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('./config');
const {Entry} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(express.static('public'));

mongoose.Promise = global.Promise;

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// app.get("/:fileName", (req, res) => {
//   res.sendFile(__dirname + '/' + req.params.fileName);
// });

app.get('/entries', (req, res) => {
  Entry
    .find()
    .exec()
    .then(entries => {
      res.json({
        entries: entries.map(entry => entry.apiRepr())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.get('/entries/:id', (req, res) => {
  Entry
    .findById(req.params.id)
    .exec()
    .then(entry => res.json(entry.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

app.post('/entries', (req, res) => {
  const requiredFields = ['charity', 'amount', 'type', 'url'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Entry
    .create({
      charity: req.body.charity,
      amount: req.body.amount,
      type: req.body.type,
      url: req.body.url
    })
    .then(entry => res.status(201).json(entry.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});


app.delete('/entries/:id', (req, res) => {
  Entry
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});


app.put('/entries/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['charity', 'amount', 'type', 'url'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Entry
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedEntry => res.status(201).json(updatedEntry.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});


app.delete('/:id', (req, res) => {
  Entry
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log(`Deleted entry with id \`${req.params.ID}\``);
      res.status(204).end();
    });
});


app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
