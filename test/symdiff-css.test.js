var extract = require('../index');

describe('symdiff-css', function() {
    it('should work with an empty css', function() {
        var result = extract('');
        expect(result.length).to.equal(0);
    });

    it('should work without selectors', function() {
        var result = extract('@import other.css;');
        expect(result.length).to.equal(0);
    });

    it('should work with invalid css', function() {
        var result = extract('this is not the css you are looking for');
        expect(result.length).to.equal(0);
    });

    it('should extract a class', function() {
        var testCSS = '.grid { display: flex; }',
            result = extract(testCSS);

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('grid');
    });

    it('should extract nothing when there are no classes', function() {
        var testCSS = '#grid { display: flex; }',
            result = extract(testCSS);

        expect(result.length).to.equal(0);
    });

    it('should not contain duplicates', function() {
        var testCSS = '.grid { flex: 0 0 auto; } .grid { color: red; }',
            result = extract(testCSS);

        expect(result.length).to.equal(1);;
    });

    it('should extract a class in a media query', function() {
        var testCSS = '@media(max-width: 100px) { .grid { display: flex; } }',
            result = extract(testCSS);

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('grid');
    });
});