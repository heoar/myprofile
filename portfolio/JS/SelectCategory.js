String.prototype.toNumeric = function() {
	var s = this;
	s = (typeof s == 'undefined' ? '0' : s.toString().replace(/,/g, ''));
	if (isNaN(s) || s.replace(/ /g, '') == '') return 0;
	else	return parseFloat(s);
}

function SelectCategory() {
	this.elements = new Array();
	this.heads = new Array();
	this.delimiter = '+';
	this.target = null;
	this.child = 0;
	this.search_division = "";
	this.search_language_type = "KOR";
}

SelectCategory.prototype = {
	addOption: function (obj, text, value) {
		if (typeof (value) == 'undefined') value = '';
		if (text) {
			var option = document.createElement('option');
			option.text = text;
			option.value = value;
			obj.options.add(option);
		}
		return option;
	},

	removeOption: function (obj, index) {
		obj.remove(index);
	},

	removeOptionAll: function (obj) {
		for (var i=obj.length-1; i>-1; i--) {
			obj.remove(i);
		}
	},

	add: function() {
		if (this.target) {
			var name = this.target.name;

			var selects = document.getElementsByTagName('select');
			for (var i=0; i<selects.length; i++) {
				if (selects[i].name.match(new RegExp(name+this.delimiter, 'gi'))) {
					var depth = selects[i].name.split(this.delimiter)[1].toNumeric();

					this.elements[depth-1] = selects[i];
					this.heads[depth-1] = selects[i].getAttribute('head');
				}
			}
		}
	},

	init: function (division, language_type, target) {
		this.search_division = division;
		this.search_language_type = language_type;

		var self = this;

		this.target = target;
		this.add();

		if (this.elements.length) {
			this.get(null, this.target.value.toNumeric());
		}
	},

	get: function (item, cate) {
		var self = this;
		var depth = (item ? item.getAttribute('depth') : 0);
		var parent = (item ? item.value : 0);

		if (depth == null) depth = 0;
		if (typeof (cate) == 'undefined') cate = 0;
		
		 // alert(depth);
		 // alert(parent);
		 // alert(cate);
		 // alert(this.search_division);
		 // alert(this.search_language_type);
		$.ajax({
			type: "GET",
			url: "board_category_ajax.php",
			data: "search_division="+this.search_division+"&search_language_type="+this.search_language_type+"&level="+depth+"&num="+cate+"&parent="+parent,
			//data: "search_division=ALL&search_language_type=KOR&level=0&num=0&parent=0",
			dataType: "json",
			success: function(objJson) {
				var depth = objJson.depth;
				var selected = objJson.selected.cate;
				var index = depth - 1;

				for (var i=index; i<self.elements.length; i++) {
					if (self.elements[i]) {
						self.removeOptionAll(self.elements[i]);
						self.addOption(self.elements[i], self.heads[i]);
					}
				}

				if (!selected) {
					self.target.value = '';
					for (var i=0; i<self.elements.length; i++) {
						if (self.elements[i].value) {
							self.target.value = self.elements[i].value;
						}
						else break;
					}
				}

				var obj = self.elements[index];
				if (obj) {
					if (objJson.list) {
						for (var i=0; i<objJson.list.length; i++) {
							var option = self.addOption(obj, objJson.list[i].name, objJson.list[i].cate);
							option.setAttribute('name', objJson.list[i].name);
							option.setAttribute('child', objJson.list[i].child);
						}
						if (selected) obj.value = selected;
					}

					/**
					if (objJson.list.length ==0) {
						obj.style.display = "none";
					} else {
						obj.style.display = "inline";
					}
					/**/

					if (self.elements.length > depth && cate) {
						self.get(self.elements[index], cate);
					}
				}
			},
			error : function(e){
				alert("분류 정보를 불러올 수 없습니다."+e);
			}
			
		});
	}
}