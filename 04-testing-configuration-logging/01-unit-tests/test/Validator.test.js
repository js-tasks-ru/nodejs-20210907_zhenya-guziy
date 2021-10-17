const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      it('проверка на корректность слишком короткого значения', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });
      it('проверка на корректность слишком длинного значения', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalalalalalalalalalalalalalalalalalalalalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 44');
      });
      it('проверка на корректность верного граничного значения', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalalalala'});

        expect(errors).to.have.length(0);
      });
      it('проверка на корректность обработки минимального значения', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalalalalalalalalalalalalalalalalalalalalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 44');
      });
    });
  });
  describe('валидатор проверяет числовые поля', () => {
    it('проверка на корректность слишком длинного значения', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({age: 29});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 29');
    });
  });

  it('проверка на отправку числа как строки', () => {
    const validator = new Validator({
      age: {
        type: 'string',
        min: 18,
        max: 27,
      },
    });

    const errors = validator.validate({age: 17});
    console.log(errors);
    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('age');
    expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
  });

  it('проверка на отправку неверного типа', () => {
    const validator = new Validator({
      age: {
        type: 'function',
        min: 18,
        max: 27,
      },
    });

    const errors = validator.validate({age: 17});
    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('age');
    expect(errors[0]).to.have.property('error').and.to.be.equal('expect function, got number');
  });

  it('проверка на отправку объекта без типа', () => {
    const validator = new Validator({
      age: {
        min: 18,
        max: 27,
      },
    });

    const errors = validator.validate({age: 17});
    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('age');
    expect(errors[0]).to.have.property('error').and.to.be.equal('expect undefined, got number');
  });
});
