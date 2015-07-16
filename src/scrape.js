var _ = require('lodash'),
    path = require('path'),
    Promise = require('bluebird'),
    cheerio = require('cheerio'),
    compressor = require('node-minify'),
    request = Promise.promisify(require('request')),
    fs = Promise.promisifyAll(require('fs')),
    target = 'https://en.wikipedia.org/wiki/Miscellaneous_Symbols_and_Pictographs';

function Icon(name, unicode) {
    var _name,
        _unicode;

    Object.defineProperty(this, 'Name', {
        configurable: true,
        enumerable: true,
        get: function get() {
            return _name;
        },
        set: function set(val) {
            this.DisplayName = val;
            
            if (val == null) {
                _name = val;
            }
            else {
                _name = val.toLowerCase().replace(/\s/g, '-');
            }
        }
    });
    
    Object.defineProperty(this, 'Unicode', {
        configurable: true,
        enumerable: true,
        get: function get() {
            return _unicode;
        },
        set: function set(val) {
            if (val == null) {
                _unicode = val;
            }
            else {
                _unicode = val.toLowerCase().replace(/^u\+/, '\\');
            }
        }
    });

    this.Name = this.DisplayName = name;
    this.Unicode = unicode;

    return this;
}

function _getHtml() {
    return request(target).spread(function (req, body) {
        return body;
    });
}

function _readHtml(body) {
    var $ = cheerio.load(body),
        results = [];

    // Get Pictographs
    $('td[title]').each(function () {
        var $td = $(this),
            title = $td.attr('title'),
            rx = /^(.+):\s(.+)$/,
            matches,
            unicode,
            name;
            
        matches = rx.exec(title);
        
        if (!matches || matches.length !== 3) {
            return;
        }
        
        unicode = matches[1];
        name = matches[2];

        results.push(new Icon(name, unicode));
    });

    return _.sortBy(results, 'DisplayName');
}

function _writeCss(icons) {
    var selectors = [];

    _.each(icons, function(icon) {
        selectors.push([
            '.fax-', icon.Name, ':before {\n',
            '  content: "', icon.Unicode, '";\n',
            '}\n'
        ].join(''));
    });

    return fs.writeFileAsync(path.join(__dirname, '..', 'css', 'font-awesome-x.css'), selectors.join('')).then(function success () {
        return icons;
    });
}

function _writeExamples(icons) {
    var rows = [];

    _.each(icons, function(icon) {
        rows.push([
            '<tr>',
                '<td><i class="fa fax-', icon.Name, '"></i></td>',
                '<td><pre>', icon.Unicode, '</td>',
                '<td>', icon.DisplayName, '</td>',
                '<td>.fa .fax-', icon.Name, '</td>',
            '</tr>'
        ].join(''));
    });

    return fs.readFileAsync(path.join(__dirname, 'index.html'), 'utf8').then(function (data) {
        data = data.replace(/{{examples}}/, rows.join('\n'));

        return fs.writeFileAsync(path.join(__dirname, '..', 'demo', 'index.html'), data);
    });
}

function _compress() {
    var resolver = Promise.defer();

    new compressor.minify({
        type: 'clean-css',
        fileIn: path.join(__dirname, '..', 'css', 'font-awesome-x.css'),
        fileOut: path.join(__dirname, '..', 'css', 'font-awesome-x.min.css'),
        callback: function(err, min) {
            if (err) {
                return resolver.reject(err);
            }

            resolver.resolve(min);
        }
    });
    
    return resolver.promise;
}

function parse() {
    return _getHtml()
        .then(_readHtml)
        .then(_writeCss)
        .then(_writeExamples)
        .then(_compress)
        .then(function () {
            console.log()
            console.log('  -----  ');
            console.log('Complete!');
        });
}

parse();