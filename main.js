//Вспомогательное
function groupThis(e) {
	var start = this.selectionStart, end = this.selectionEnd;
	e = e || window.event;
	this.value = this.value.replace(/\s/g, "");
	this.value = groupNums(this.value);
}

function go(e) {
	e = e || window.event;
	if(e.keyCode === 13) gc("input[value = 'Рассчитать']").onclick();
}

function checkNumbers(inputs) {
	var x, result = true;
	inputs = inputs || [this];
	for(x = 0; x < inputs.length; x++) {
		if( isNaN( parseFloat( inputs[x].value ) ) || inputs[x].value === "") {
			if ( !inputs[x].getAttribute( "data-oldClass" ) ) {
				inputs[x].setAttribute("data-oldClass", inputs[x].className);
			}
			inputs[x].className = "wrong";
			result = false;
			
		} else {
			inputs[x].className = inputs[x].getAttribute( "data-oldClass" );
		}
	}
	return result;
}

//Оператор расчёта
gc("input[value = 'Расчёт']").onclick = (
	function() {
		var 
			term = gc(".calc input[name = 'term']"),
			rate = gc(".calc input[name = 'rate']"),
			sum = gc(".calc input[name = 'sum']"),
			firstPayment = gc(".calc input[name = 'firstPayment']"),
			report = gc("#report")
		;
		
		sum.onchange = function() {
			checkNumbers.call(this);
			groupThis.call(this);
		}
		term.onchange = rate.onchange = function() {
			checkNumbers.call(this);
		}
		firstPayment.onkeyup = rate.onkeyup = go;
		
		return function()	{
			var 
				proc = ( firstPayment.value.replace( /\s/g, "" ).substr( -1 ) === "%" ), result,
				type = gc.getCheckedValues('paymentType')[0],
				fP = parseFloat( firstPayment.value.replace( /\s/g, "" ) ),
				textReport = "",
				summ = sum.value.replace(/\s/g, "")
			;
			if( isNaN( fP ) ) fP = 0;
			fP = proc ? summ * ( fP / 100 ) : fP;
			
			if( !checkNumbers( gc( ".calc input.needCheck, .calc input.wrong", true ) ) ) {
				textReport = "<p>В отмеченных полях обязательно должны быть цифры. Исправьте, пожалуйста, иначе расчёт сделать не получится.</p>";
			} else {
				result = calculateCredit[type]((summ - fP), term.value, rate.value);
				textReport += "<table class = 'reportTable'><tr>";
				textReport += "<td class = ''>Сумма кредита: </td><td>" + (summ - fP) + "</td><tr>";
				textReport += "<td>Придётся переплатить за весь срок: </td><td>" + result.overpay + " (" + ( ( result.overpay / summ ) * 100 ).toFixed( 2 )  + "%)</td><tr>";
				textReport += "<td>Всего нужно отдать: </td><td>" + result.total + "</td><tr>";
				textReport += "</table>";
				textReport += "<h3>Платежи</h3>";
				textReport += "<div class = 'column'>";
			
				for(x = 0; x < result.payments.length; x++) {
					if(type === "annuitet") {
						textReport += "<p class = 'payment'>" + result.payments[x] + " X " + term.value + "</p>";
						break
					}
					textReport += "<p class = 'payment'>" + ( x + 1 ) + ") " + result.payments[x];
					textReport += "</p>";
					if( ( x + 1 ) % 12 === 0 ) textReport += "</div><div class = 'column'>";
				}
				textReport += "</div>";
				textReport = textReport.replace(/NaN/g, "?");
				textReport = groupNums(textReport);
			}
			report.innerHTML = textReport;
		}
	}
)()