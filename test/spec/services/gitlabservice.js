'use strict';

describe('Service: gitLabService', function () {

  // load the service's module
  beforeEach(module('branchWatcherApp'));

  // instantiate service
  var gitLabService;
  beforeEach(inject(function (_gitLabService_) {
    gitLabService = _gitLabService_;
  }));

  it('should do something', function () {
    expect(!!gitLabService).toBe(true);
  });

});
