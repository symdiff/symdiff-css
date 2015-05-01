var css = require('css'),
    CLASS_REGEX = /\.[a-zA-Z](?:[0-9A-Za-z_-])*/g;

function flatten(prev, cur) {
    prev.push.apply(prev, cur);
    return prev;
}

function symdiffCSS(cssString) {
    var ast;
    try {
        ast = css.parse(cssString);
    } catch(e) {
        return [];
    }

    if (!ast.stylesheet) {
        return [];
    }

    return  ast
            .stylesheet
            .rules
            .map(function(rule) {
                var selectors;

                if (rule.type === 'rule') {
                    selectors = rule.selectors;
                } else if (rule.type === 'media') {
                    selectors = rule
                            .rules
                            .map(function(r) {
                                return r.selectors;
                            })
                            .reduce(flatten, []);
                } else {
                    return [];
                }
                return  selectors
                        .map(function(selector) {
                            var matches = selector.match(CLASS_REGEX);
                            if (!matches) {
                                return;
                            }

                            return  matches
                                    .map(function(match) {
                                        // remove leading dot
                                        return match.substring(1);
                                    });
                        });
            })
            // now flatten twice
            .reduce(flatten, [])
            .reduce(flatten, [])
            // and remove duplicates
            .filter(function(c, i, all) {
                return all.lastIndexOf(c) === i;
            });
}

module.exports = symdiffCSS;