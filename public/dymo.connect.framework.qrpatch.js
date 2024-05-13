dymo.label.framework.Label.prototype.setObjectText = function(e, o) {
	var t = this._getObjectByNameElement(e);
	switch (t.tagName) {
		case "AddressObject":
		case "TextObject":
			this._setAddressObjectText(t, o);
			break;
		case "QRCodeObject":
			this._setQRCodeObjectText(t, o);
			break;
		case "BarcodeObject":
			this._setBarcodeObjectText(t, o);
			break;
		case "ImageObject":
			this._setImageObjectText(t, o);
			break;
		case "CircularTextObject":
			this.isDCDLabel() ? this._setAddressObjectText(t, o) : dymo.xml.setElementText(dymo.xml.getElement(t, "Text"), o);
			break;
		case "DateTimeObject":
		case "CounterObject":
			this._setDateTimeCounterObjectText(t, o)
	}
	return this
}
dymo.label.framework.Label.prototype._setQRCodeObjectText = function(objectElem, text) {
	if (this.isDCDLabel()) {
		let dataElem = dymo.xml.getElement(objectElem, "Data");
		if (dataElem) {
			let dataStringElem = dymo.xml.getElement(dataElem, "DataString");
			dymo.xml.setElementText(dataStringElem, text);
		}
		dataElem = dymo.xml.getElement(objectElem, "TextDataHolder");
		if (dataElem) {
			let dataStringElem = dymo.xml.getElement(dataElem, "Value");
			dymo.xml.setElementText(dataStringElem, text);
		}
	}
	return this;
}
