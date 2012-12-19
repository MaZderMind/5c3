// Generated by CoffeeScript 1.3.3
(function() {
  var FiveC3, top,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  top = this;

  FiveC3 = (function() {

    function FiveC3() {
      this.getTemplates = __bind(this.getTemplates, this);

      var templateFiles, typeaheadOptions;
      this.events = [];
      this.typeaheadStrings;
      this.lastFullScreenItem;
      this.templates = {};
      this.isotopeContainer = $('#eventItems');
      this.isotopeContainer.isotope({
        itemSelector: '.item',
        layoutMode: 'masonry',
        animationMode: 'css'
      });
      $(window).resize(function() {
        return console.log('resized');
      });
      templateFiles = ['item'];
      this.getTemplates(templateFiles);
      this.refreshEventData();
      typeaheadOptions = {
        minLenght: 2,
        source: this.typeaheadStrings
      };
      $('.typeahead').typeahead(typeaheadOptions);
    }

    FiveC3.prototype.getTemplates = function(templateFiles) {
      var templateFileName, _i, _len, _results,
        _this = this;
      _results = [];
      for (_i = 0, _len = templateFiles.length; _i < _len; _i++) {
        templateFileName = templateFiles[_i];
        _results.push($.ajax({
          url: '/tpl/' + templateFileName + '.html',
          success: function(dataFromServer) {
            return _this.templates[templateFileName] = doT.template(dataFromServer);
          },
          async: false
        }));
      }
      return _results;
    };

    FiveC3.prototype.writeEvents = function() {
      var evnt, item, _i, _len, _ref, _results,
        _this = this;
      console.log($('#eventItems'));
      _ref = this.events;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evnt = _ref[_i];
        item = $(this.templates.item(evnt));
        item.click(function(e) {
          if (_this.lastFullScreenItem) {
            _this.lastFullScreenItem.css('width', '');
            _this.lastFullScreenItem.css('height', '');
          }
          item = $(e.target);
          if (!item.hasClass('item')) {
            item = item.parents('.item');
          }
          console.log(item);
          item.width(640);
          item.height(360);
          _this.isotopeContainer.isotope('reLayout');
          return _this.lastFullScreenItem = $(item);
        });
        _results.push(this.isotopeContainer.isotope('insert', item));
      }
      return _results;
    };

    FiveC3.prototype.refreshEventData = function() {
      var _this = this;
      return $.ajax({
        url: 'testdata/schedule.en.xml',
        datatype: 'xml',
        success: function(dataFromServer) {
          _this.events = [];
          $('event', dataFromServer).each(function(index, eventDom) {
            var evnt;
            evnt = {};
            evnt.start = $('start', eventDom).text();
            evnt.id = $(eventDom).attr('id');
            evnt.duration = $('duration', eventDom).text();
            evnt.title = $('title', eventDom).text();
            evnt.subtitle = $('subtitle', eventDom).text();
            return _this.events.push(evnt);
          });
          return _this.writeEvents();
        },
        async: true
      });
    };

    return FiveC3;

  })();

  $(document).ready(function() {
    return top.fiveC3 = new FiveC3();
  });

}).call(this);
