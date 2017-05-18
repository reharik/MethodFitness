var SUT = require('./../../src/papers');
var chai = require('chai');
chai.should();

describe('PAPERS', () => {
  describe('when_calling_with_no_config_values', () => {
    it('should_throw_proper_error', () => {
      var result;
      try {
        result = SUT().registerMiddleware()
      }catch(ex){
        result = ex.message;
      }
      result.should.equal('You must provide at lease one strategy.');
    })
  });

  describe('when_calling_with_empty_strategies', () => {
    it('should_throw_proper_error', () => {
      var result;
      try {
        result = SUT().registerMiddleware({strategies:[]})
      }catch(ex){
        result = ex.message;
      }
      result.should.equal('You must provide at lease one strategy.');
    })
  });

  describe('when_calling_with_session_but_no_serializers_or_deserializers', () => {
    it('should_throw_proper_error', () => {
      var result;
      var config = {
        strategies:[()=>{}],
        useSession:true
      };

      try {
        result = SUT().registerMiddleware(config)
      }catch(ex){
        result = ex.message;
      }
      result.should.equal('You must provide at least one user serializer and one user deserializer if you want to use session.');
    })
  });

  describe('when_calling_with_session_but_no_serializers', () => {
    it('should_throw_proper_error', () => {
      var result;
      var config = {
        strategies:[()=>{}],
        deserializers:[()=>{}],
        useSession:true
      };

      try {
        result = SUT().registerMiddleware(config)
      }catch(ex){
        result = ex.message;
      }
      result.should.equal('You must provide at least one user serializer and one user deserializer if you want to use session.');
    })
  });

  describe('when_calling_with_session_but_no_deserializers', () => {
    it('should_throw_proper_error', () => {
      var result;
      var config = {
        strategies:[()=>{}],
        serializers:[()=>{}],
        useSession:true
      };

      try {
        result = SUT().registerMiddleware(config)
      }catch(ex){
        result = ex.message;
      }
      result.should.equal('You must provide at least one user serializer and one user deserializer if you want to use session.');
    })
  });

  describe('when_calling_with_valid_config', () => {
    var result;
    beforeEach(() => {
      var config = {
        strategies:[()=>{}],
        serializers:[()=>{}],
        deserializers:[()=>{}],
        useSession:true
      };
      result = SUT().registerMiddleware(config);
    });

    it('should_return_middleware_function', () => {
      result.should.be.function;
    });

    it('should_have_proper_arity', () => {
      result.length.should.equal(1);
    })
  })
});