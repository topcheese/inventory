// Generated by CoffeeScript 1.6.3
(function() {
  var Inventory, Item, ItemStack, deepEqual;

  deepEqual = require('deep-equal');

  Inventory = (function() {
    function Inventory(opts) {
      var size, _ref;
      opts = opts != null ? opts : {};
      size = (_ref = opts.size) != null ? _ref : 10;
      this.array = new Array(size);
    }

    Inventory.prototype.give = function(itemStack) {
      var excess, i, _i, _j, _ref, _ref1;
      for (i = _i = 0, _ref = this.array.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if ((this.array[i] != null) && this.array[i].canStackWith(itemStack)) {
          excess = this.array[i].mergeStack(itemStack);
        }
        if (itemStack.count === 0) {
          break;
        }
      }
      for (i = _j = 0, _ref1 = this.array.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        if (this.array[i] == null) {
          this.array[i] = new ItemStack(itemStack.item, 0);
          excess = this.array[i].mergeStack(itemStack);
        }
        if (itemStack.count === 0) {
          break;
        }
      }
      return excess;
    };

    Inventory.prototype.take = function(itemStack) {
      var given, i, n, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.array.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if ((this.array[i] != null) && this.array[i].matchesTypeAndTags(itemStack)) {
          n = Math.min(itemStack.count, this.array[i].count);
          itemStack.count -= n;
          given = this.array[i].splitStack(n);
          if (this.array[i].count === 0) {
            _results.push(this.array[i] = void 0);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Inventory.prototype.toString = function() {
      var a, i, itemStack, _i, _len, _ref;
      a = [];
      _ref = this.array;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        itemStack = _ref[i];
        if (itemStack == null) {
          a.push('');
        } else {
          a.push("" + itemStack);
        }
      }
      return a.join(',');
    };

    return Inventory;

  })();

  ItemStack = (function() {
    function ItemStack(item, count, tags) {
      this.item = item;
      this.count = count != null ? count : 1;
      this.tags = tags != null ? tags : {};
      this.maxStackSize = 64;
    }

    ItemStack.prototype.hasTags = function() {
      return Object.keys(this.tags).length !== 0;
    };

    ItemStack.prototype.matchesType = function(itemStack) {
      return this.item === itemStack.item;
    };

    ItemStack.prototype.matchesTypeAndCount = function(itemStack) {
      return this.item === itemStack.item && this.count === itemStack.count;
    };

    ItemStack.prototype.matchesTypeAndTags = function(itemStack) {
      return this.item === itemStack.item && deepEqual(this.tags, itemStack.tags, {
        strict: true
      });
    };

    ItemStack.prototype.matchesAll = function(itemStack) {
      return this.matchesTypeAndCount(itemStack) && deepEqual(this.tags, itemStack.tags, {
        strict: true
      });
    };

    ItemStack.prototype.canStackWith = function(itemStack) {
      if (itemStack.item !== this.item) {
        return false;
      }
      if (itemStack.hasTags() || this.hasTags()) {
        return false;
      }
      return true;
    };

    ItemStack.prototype.mergeStack = function(itemStack) {
      if (!this.canStackWith(itemStack)) {
        return false;
      }
      return itemStack.count = this.increase(itemStack.count);
    };

    ItemStack.prototype.increase = function(n) {
      var excessCount, newCount, _ref;
      _ref = this.tryAdding(n), newCount = _ref[0], excessCount = _ref[1];
      this.count = newCount;
      return excessCount;
    };

    ItemStack.prototype.decrease = function(n) {
      var remainingCount, removedCount, _ref;
      _ref = this.trySubtracting(n), removedCount = _ref[0], remainingCount = _ref[1];
      this.count = remainingCount;
      return removedCount;
    };

    ItemStack.prototype.tryAdding = function(n) {
      var sum;
      sum = this.count + n;
      if (sum > this.maxStackSize) {
        return [this.maxStackSize, sum - this.maxStackSize];
      } else {
        return [sum, 0];
      }
    };

    ItemStack.prototype.trySubtracting = function(n) {
      var difference;
      difference = this.count - n;
      if (difference < 0) {
        return [this.count, n - this.count];
      } else {
        return [n, this.count - n];
      }
    };

    ItemStack.prototype.splitStack = function(n) {
      if (n > this.count) {
        return false;
      }
      this.count -= n;
      return new ItemStack(this.item, n, this.tags);
    };

    ItemStack.prototype.toString = function() {
      if (this.hasTags()) {
        return "" + this.count + ":" + this.item + " " + (JSON.stringify(this.tags));
      } else {
        return "" + this.count + ":" + this.item;
      }
    };

    return ItemStack;

  })();

  Item = (function() {
    function Item(opts) {
      var k, v;
      for (k in opts) {
        v = opts[k];
        this[k] = v;
      }
    }

    return Item;

  })();

  module.exports.Inventory = Inventory;

  module.exports.ItemStack = ItemStack;

  module.exports.Item = Item;

}).call(this);
