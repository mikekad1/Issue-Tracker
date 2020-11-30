const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  suite('POST /api/issues/{project}', function() {
    
    test('Every field filled in', function(done) {
      const requestBody = {
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      };

      chai.request(server)
      .post('/api/issues/test')
      .send(requestBody)
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body._id);
        assert.equal(res.body.issue_title, requestBody.issue_title);
        assert.equal(res.body.issue_text, requestBody.issue_text);
        assert.equal(res.body.created_by, requestBody.created_by);
        assert.equal(res.body.assigned_to, requestBody.assigned_to);
        assert.equal(res.body.status_text, requestBody.status_text);
        assert.equal(res.body.open, true);
        assert.exists(res.body.created_on);
        assert.exists(res.body.updated_on);
        done();
      });
    });
    
    test('Required fields filled in, Optional Fields Blank', function(done) {
      const requestBody = {
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
      };

      chai.request(server)
      .post('/api/issues/test')
      .send(requestBody)
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body._id);
        assert.equal(res.body.issue_title, requestBody.issue_title);
        assert.equal(res.body.issue_text, requestBody.issue_text);
        assert.equal(res.body.created_by, requestBody.created_by);
        assert.equal(res.body.assigned_to, requestBody.assigned_to);
        assert.equal(res.body.status_text, '');
        assert.equal(res.body.open, true);
        assert.exists(res.body.created_on);
        assert.exists(res.body.updated_on);
        done();
      });
    });
    
    test('Missing required fields => { error: "required field(s) missing" }', function(done) {
      const requestBody = {
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
      };

      chai.request(server)
      .post('/api/issues/test')
      .send(requestBody)
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
    });
    
  });

  suite('GET /api/issues/{project}', function() {
    
    test('No filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
    test('One filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({ issue_title: 'Title' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body[0].issue_title, 'Title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({ issue_title: 'Title', issue_text: 'text' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body[0].issue_title, 'Title');
        assert.equal(res.body[0].issue_text, 'text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
  });
  
  suite('PUT /api/issues/{project}', function() {
          
    test('One field to update => {result: "successfully updated", _id: _id}', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({ _id: '5fc032be2101c72bd036401a', issue_title: 'Mamma mia' + Math.random() })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '5fc032be2101c72bd036401a');
        done();
      });
    });
    
    test('Multiple fields to update => {result: "successfully updated", _id: _id}', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({ _id: '5fc031cb5627491178762cbd', issue_title: 'Mamma mia' + Math.random(), assigned_to: 'Me' + Math.random() })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '5fc031cb5627491178762cbd');
        done();
      });
    });

    test('No _id submitted => { error: "missing _id" }', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({ issue_title: 'Mamma mia', assigned_to: 'Me' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });

    test('No fields to update => { error: "no update field(s) sent", _id: _id }', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({ _id: '5fc031cb5627491178762cbd' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, '5fc031cb5627491178762cbd');
        done();
      });
    });

    test('Invalid _id => { error: "could not update" }', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({ _id: 'invalid id' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, 'invalid id');
        done();
      });
    });
    
  });
   
  
  suite('DELETE /api/issues/{project}', function() {

    test('Valid _id', function(done) {
      
      done();
    });
    test('Invalid _id => { error: "could not delete", "_id": _id }', function(done) {
      const badId = "5f665eb46e296f6b9b6a504d";

      chai.request(server)
      .delete('/api/issues/test')
      .send({ _id: badId })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, badId);
        done();
      });
    });
    
    test('No _id => { error: "missing _id" }', function(done) {
      chai.request(server)
      .delete('/api/issues/test')
      .send()
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });
  });
});
