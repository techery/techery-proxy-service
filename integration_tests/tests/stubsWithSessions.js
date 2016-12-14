'use strict';

describe('Stubs with sessions api', function () {

  var headers = {};

  before(function() {
    headers[config.app.hermet_session_header] = "tests_session";
    return utils.flushDB();
  });

  context('should perform CRUD operations', function () {
    var serviceId;

    before(function() {
      return hermetApiClient.post('/services', fixtures.services.stubCrud, {}, headers).then(function (result) {
        expect(result).to.have.status(201);

        serviceId = utils.getItemIdFromLocation(result.response.headers.location);

        return chakram.wait();
      });
    });

    context('should create new stub for proxy rule', function () {
      var stubData = {
        response: 'Ok',
        predicate: {equals: {field: 'value'}}
      };

      var stubId;

      before(function(){
        return hermetApiClient.post('/services/' + serviceId + '/stubs', stubData, {}, headers).then(function(result) {
          expect(result).to.have.status(201);

          stubId = utils.getItemIdFromLocation(result.response.headers.location);
        });
      });

      it('should return stub created for this session', function() {
        var response = hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId, {}, headers);
        expect(response).to.have.status(200);
        expect(response).to.comprise.of.json(stubData);

        return chakram.wait();
      });

      it('should has empty response without session header', function() {
        var response = hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId);
        expect(response).to.have.status(404);

        return chakram.wait();
      });
    });

    context('should update stub for proxy rule', function () {
      var stubData = {
        response: 'Success',
        predicates: [
          {equals: {field: 'value'}}
        ]
      };
      var stubId = uuid();

      before(function(){
        var response = hermetApiClient.put('/services/' + serviceId + '/stubs/' + stubId, stubData, {}, headers);
        expect(response).to.have.status(204);

        return chakram.wait();
      });

      it('should return stub updated in this session', function() {
        var response = hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId, {}, headers);
        expect(response).to.have.status(200);
        expect(response).to.comprise.of.json(stubData);

        return chakram.wait();
      });

      it('should has empty response without session header', function() {
        var response = hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId);
        expect(response).to.have.status(404);

        return chakram.wait();
      });
    });

    it('should remove stub from proxy rule', function () {
      var stubData = {
        response: 'Ok',
        predicates: [
          {equals: {field: 'value'}}
        ]
      };

      var stubId;

      var response = hermetApiClient.post('/services/' + serviceId + '/stubs', stubData, {}, headers).then(function(result) {
        expect(result).to.have.status(201);

        stubId = utils.getItemIdFromLocation(result.response.headers.location);

        return hermetApiClient.delete('/services/' + serviceId + '/stubs/' + stubId, {}, headers);
      }).then(function(response) {
        expect(response).to.have.status(204);

        return hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId, {}, headers);
      });

      expect(response).to.have.status(404);

      return chakram.wait();
    });

    it('should can retrieve all stubs', function () {
      var response = hermetApiClient.get('/services/' + serviceId + '/stubs', {}, headers);
      expect(response).to.have.status(200);

      return chakram.wait();
    });
  });
});