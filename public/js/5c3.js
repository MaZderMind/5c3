// Generated by CoffeeScript 1.3.3
(function() {
  var FiveC3, top,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  top = this;

  top.replaceHtml = function(el, html) {
    var newEl, oldEl;
    if (typeof el === 'string') {
      oldEl = document.getElementById(el);
    } else {
      oldEl = el;
    }
    newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    return newEl;
  };

  FiveC3 = (function() {

    function FiveC3() {
      this.playcount = __bind(this.playcount, this);

      this.initPlayer = __bind(this.initPlayer, this);

      this.itemAdded = __bind(this.itemAdded, this);

      this.onItemMouseMove = __bind(this.onItemMouseMove, this);

      this.onItemClick = __bind(this.onItemClick, this);

      this.getEventById = __bind(this.getEventById, this);

      this.writtenEvents = __bind(this.writtenEvents, this);

      this.writeEvents = __bind(this.writeEvents, this);

      this.getTemplates = __bind(this.getTemplates, this);

      this.filterEvents = __bind(this.filterEvents, this);

      var templateFiles;
      this.events = [];
      this.typeaheadStrings;
      this.columns = 5;
      this.lastactiveitem = {};
      this.displayData = {};
      this.templates = {};
      templateFiles = ['item', 'items', 'popunder'];
      this.getTemplates(templateFiles);
      this.refreshEventData();
    }

    FiveC3.prototype.filterEvents = function(filterattributes) {
      var filteredData, i, item, j, _i, _len,
        _this = this;
      console.log('Filtering');
      this.filterattributes = filterattributes;
      console.log(this.events);
      filteredData = this.events.slice(0);
      filteredData = filteredData.filter(function(event) {
        var k, v, _ref;
        _ref = _this.filterattributes;
        for (k in _ref) {
          v = _ref[k];
          if (event[k] === v) {
            return true;
          }
        }
        return false;
      });
      i = 0;
      j = 0;
      this.displayData.rows = [];
      this.displayData.rows[0] = [];
      this.displayData.rows[0].rownumber = 0;
      for (_i = 0, _len = filteredData.length; _i < _len; _i++) {
        item = filteredData[_i];
        item.number = i;
        item.row = j;
        this.displayData.rows[j].push(item);
        i = i + 1;
        if (item.number % this.columns === this.columns - 1) {
          j = j + 1;
          this.displayData.rows[j] = [];
          this.displayData.rows[j].rownumber = j;
        }
      }
      return console.log(this.displayData);
    };

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

    FiveC3.prototype.writeEvents = function(cb) {
      var items;
      items = this.templates.items(this.displayData);
      top.replaceHtml("content", items);
      return this.writtenEvents();
    };

    FiveC3.prototype.writtenEvents = function(items) {
      return $('.item').each(function() {
        var item;
        item = $(this);
        return item.click(top.fiveC3.onItemClick);
      });
    };

    FiveC3.prototype.refreshEventData = function() {
      var _this = this;
      return $.ajax({
        url: '/events',
        datatype: 'json',
        success: function(dataFromServer) {
          _this.events = dataFromServer;
          _this.filterEvents({
            conference: '29th Chaos Communication Congress'
          });
          return _this.writeEvents();
        },
        async: true
      });
    };

    FiveC3.prototype.getEventById = function(id) {
      var evnt, _i, _len, _ref;
      _ref = this.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evnt = _ref[_i];
        if (evnt._id === id) {
          return evnt;
        }
      }
    };

    FiveC3.prototype.onItemClick = function(e) {
      var eventObject, item, lastRow, row;
      console.log('click');
      item = $(e.currentTarget);
      item.id = item.attr('id');
      item.row = item.attr('data-row');
      item._id = item.attr('data-event-id');
      console.log(item.id);
      console.log(this.lastactiveitem.id);
      if (item.id !== this.lastactiveitem.id) {
        console.log('A item was clicked that"s not the previous one');
        eventObject = this.getEventById(item._id);
        if (item.row !== this.lastactiveitem.row) {
          row = $('#row' + item.row);
          lastRow = $('#row' + this.lastactiveitem.row);
          lastRow.css('max-height', '0px');
          row.css('max-height', '300px');
        }
        top.replaceHtml('rowcontent_' + item.row, this.templates.popunder(eventObject));
        this.initPlayer(eventObject);
        return this.lastactiveitem = item;
      }
    };

    FiveC3.prototype.onItemMouseMove = function(e) {};

    FiveC3.prototype.itemAdded = function(addedItem) {
      addedItem.click(this.onItemClick);
      return addedItem.mousemove(this.onItemMouseMove);
    };

    FiveC3.prototype.initPlayer = function(evnt) {
      var _this = this;
      return this.player = new MediaElementPlayer($('video'), {
        success: function(mediaElement, domObject) {
          _this.activeEvent = evnt._id;
          mediaElement.addEventListener("play", (function(e) {
            return _this.player.timer = setInterval("fiveC3.playcount()", 20000);
          }), false);
          return mediaElement.addEventListener("pause", (function(e) {
            return clearInterval(_this.player.timer);
          }), false);
        }
      });
    };

    FiveC3.prototype.playcount = function() {
      return $.post("/event/" + this.activeEvent, function(data) {});
    };

    return FiveC3;

  })();

  $(document).ready(function() {
    return top.fiveC3 = new FiveC3();
  });

}).call(this);
