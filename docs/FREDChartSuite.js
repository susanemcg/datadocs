function loadFREDChart(chart_info, targetDiv, render_type){

	//start by loading the data; we assume jQuery has loaded
	$.get(chart_info.source, function(chart_data){
		createChart(chart_data, chart_info, targetDiv, render_type);
	}, 'json');

}

function createChart(data, meta, div, render_as){


	if(meta.type == 'line_graph'){
		var theChart = new LineChart(data, meta, div, render_as);
	}
	if(meta.type == 'circle_chart'){
		var theChart = new CircleChart(data, meta, div, render_as);
	}	
}


function CircleChart(chart_data, chart_meta, target_div, render_format){

	var that = this;

	//first get width & height of target div, then make x & y axes 80% of total allowance
	var targetCSS = target_div.currentStyle || getComputedStyle(target_div,null);
	this.chartWidth = targetCSS.width;
	this.chartHeight = targetCSS.height;

	//build the frame/background with labels
	var chart_frame = document.createElement('div');
		chart_frame.style.width = '100%';
		chart_frame.style.height = '100%';
		chart_frame.style.position = 'absolute';

	this.data = chart_data;
	this.meta = chart_meta;
	this.target = target_div;
	var format = render_format;
	
	this.target.appendChild(chart_frame);


	this.validateData = function(data_list){
		//used by public method addSeries to check that new data is compatible with 
		//existing frame/layout; also removes/accounts for flag values
		//reformats data as an array of objects

		var compiled_list = [];


		for(var i=0; i<data_list.length; i++){
			var dataObj = data_list[i];
			/*
			var dataObj = {};
			for (var p=0; p < data_list[i].attributes.length; p++){
				var xml_attr = data_list[i].attributes[p]; 
				dataObj[xml_attr.name] = xml_attr.value;
			}
			*/

			//if "value" is FRED flag value, eliminate from data set
			if(dataObj.value != "."){
				compiled_list.push(dataObj);
			}


			
		}

		return (compiled_list)
	}	


	var made_data = this.validateData(chart_data.observations);



	function createFrame(data_complete){

		//first deal with existing gif format
		if(format == 'gif'){

			//for now this only appends the title; really should also create key
			var mainTitle = returnHandDrawn(chart_meta.title.text, chart_meta.title.fontSize);
				
				mainTitle.style.position= 'absolute';
				mainTitle.style.width = '100%';

				chart_frame.appendChild(mainTitle);
			

		}
	}		

	createFrame(made_data);

	this.max_val = this.findMax(made_data);
	this.max_area = Math.PI*Number(chart_meta.axis.max_radius)*Number(chart_meta.axis.max_radius);


	var currentValue = this.addCircle(Number(made_data[0].value), 'lin'); //add circle for the current month
		currentValue.style.position = 'absolute';
		currentValue.style.top = chart_meta.title.fontSize +5+'px';

	var changeValue = this.addCircle(Math.abs(Number(made_data[0].value)- Number(made_data[1].value)), 'chg'); //add circle for its difference from last month
		changeValue.style.position = 'absolute';
		changeValue.style.top = chart_meta.title.fontSize +5+'px';
		changeValue.style.left = chart_meta.axis.max_radius*2+'px';

	chart_frame.appendChild(currentValue);
	chart_frame.appendChild(changeValue);


}


CircleChart.prototype.addCircle = function (value, units){

	var a_circle = document.createElement('div');
		a_circle.style.width = Number(this.meta.axis.max_radius)*2+'px';
		a_circle.style.height = Number(this.meta.axis.max_radius)*2+Number(this.meta.axis.fontSize)+'px';


	var radius = Math.sqrt((value*this.max_area)/(this.max_val*Math.PI));

	var title, circle_class;

	if(units == 'lin'){
		title = 'Total';
		circle_class = 'dashedCircle';
	}
	if(units == 'chg'){
		title = 'Change';
		circle_class = 'gifCircle';
	}

	var circle_title = returnHandDrawn(title, this.meta.axis.fontSize);
		circle_title.style.width = '100%';
		circle_title.textAlign = 'center';

		a_circle.appendChild(circle_title);

	var theCircle = new Circle(value, units, radius, circle_class);

	a_circle.appendChild(theCircle.icon);
	
	theCircle.icon.style.top = (Number(this.meta.axis.max_radius) - Number(radius))+'px';
	theCircle.icon.style.left = (Number(this.meta.axis.max_radius) - Number(radius))+'px';

	return(a_circle);

}

function Circle(value, units, the_radius, css_class){


	this.icon = document.createElement('div');
	this.icon.className = css_class;

	this.icon.style.width = the_radius*2+'px';
	this.icon.style.height = the_radius*2+'px';

	var info_label = document.createElement('div');
		info_label.style.position = 'absolute';
		//handle label positioning based on the size of the circle
	var labelTopLeft = [Math.round(the_radius/4), (the_radius*2)+10];
		if(the_radius > 50){
			labelTopLeft = [the_radius,the_radius-30];
		}
		info_label.style.top = labelTopLeft[0]+'px';
		info_label.style.left = labelTopLeft[1]+'px';
		info_label.appendChild(returnHandDrawn(value, 20));
		info_label.style.display = 'none';
		info_label.style.width = '200px';

	this.icon.appendChild(info_label);

	this.icon.addEventListener("mouseover", this.showData, false);
	this.icon.addEventListener("mouseout", this.hideData, false);

	return (this)
}

Circle.prototype.showData = function(e){

	this.children[0].style.display = 'block';
}

Circle.prototype.hideData = function(e){
	this.children[0].style.display = 'none';
}



CircleChart.prototype.findMax = function(data_array){

		var value_array = [];
		
		for(var i=0; i<data_array.length; i++){
			value_array.push(Number(data_array[i].value));
		}

		
		return(Math.ceil((Array.max(value_array) / 100000) * 100000))
}




function LineChart(chart_data, chart_meta, target_div, render_format){

	var that = this;

	//first get width & height of target div, then make x & y axes 80% of total allowance
	var targetCSS = target_div.currentStyle || getComputedStyle(target_div,null);
	this.axisWidth = stripPx(targetCSS.width)*.8;
	this.axisHeight = stripPx(targetCSS.height)*.8;
	this.axisIndent = [this.axisHeight*.1, this.axisWidth*.1]; //top, left
	var xIndent = Math.round(this.axisWidth*.05);

	//build the frame/background with labels
	var chart_frame = document.createElement('div');
		chart_frame.style.width = '100%';
		chart_frame.style.height = '100%';
		chart_frame.style.position = 'absolute';

	this.validateSeries = function(data_list){
		//used by public method addSeries to check that new data is compatible with 
		//existing frame/layout; also removes/accounts for flag values
		//reformats data as an array of objects

		var compiled_list = [];

		for(var i=0; i<data_list.length; i++){

			var dataObj = data_list[i];

			//also add "units" parameter
			dataObj["units_label"] = chart_meta.yAxis.units_label;

			//if "value" is FRED flag value, eliminate from data set
			if(dataObj.value != "."){
				compiled_list.push(dataObj);
			}


			
		}

		return (compiled_list)
	}	

	this.data = chart_data;
	this.meta = chart_meta;
	this.target = target_div;
	var format = render_format;

	var allPoints = this.validateSeries(chart_data.observations);

	this.target.appendChild(chart_frame);

	this.chartMax = this.findMax(allPoints);


	this.x_interval = (this.axisWidth - 5)/(allPoints.length);
	this.y_interval = this.axisHeight/(this.chartMax+1);


	//private function creates the frame div; just for encapsulation/style
	function createFrame(data_complete){

		//first deal with existing gif format
		if(format == 'gif'){

			//create & position title & description
			var mainTitle = returnHandDrawn(chart_meta.title.text, chart_meta.title.fontSize);
			var desc = returnHandDrawn(chart_meta.description.text, chart_meta.description.fontSize);

			//align title & description to left axis
			mainTitle.style.position = desc.style.position = 'absolute';
			mainTitle.style.left = desc.style.left = that.axisIndent[1]+'px';
			mainTitle.style.width = desc.style.width = '100%';

			//position description below main title
			desc.style.top = chart_meta.title.fontSize + Math.round(chart_meta.title.fontSize*.1)+'px';

			chart_frame.appendChild(mainTitle);
			//chart_frame.appendChild(desc);

			//draw x & y axis
			var yAxis = document.createElement('div');

				yAxis.style.backgroundImage = 'url(assets/graphElements/tileLineVert_300px.gif)';
				yAxis.style.backgroundAttachment = 'fixed';
				yAxis.style.backgroundPosition = 'center center';
				yAxis.style.width = '3px';
				yAxis.style.height = that.axisHeight+'px';
				yAxis.style.position = 'absolute';
				yAxis.style.top = that.axisIndent[0]+'px';
				yAxis.style.left = that.axisIndent[1]+'px';

			chart_frame.appendChild(yAxis);


			var yLabels = document.createElement('div')
				yLabels.style.width = that.axisIndent[1]+'px';
				yLabels.style.height = that.axisHeight+'px';
				yLabels.style.position = 'absolute';
				yLabels.style.top = that.axisIndent[0]+'px';

			var yAxisDek = returnHandDrawn(chart_meta.yAxis.label,chart_meta.yAxis.fontSize);
				yAxisDek.style.position = 'absolute';
				yAxisDek.style.width = yAxisDek.style.top = that.axisHeight+'px';
				yAxisDek.style.textAlign = 'center';
				yAxisDek.style.height = yAxisDek.style.left = chart_meta.yAxis.fontSize+5+'px';

				that.addRotation(yAxisDek, -90);

				yLabels.appendChild(yAxisDek);

			chart_frame.appendChild(yLabels);

			var yLabelGap = Number(chart_meta.yAxis.increment);

			for (var l = 0; l <= that.chartMax+1; l++){

				if(l%yLabelGap == 0){

					var tickTop = that.axisHeight - (l*that.y_interval);

					var yLabel = document.createElement('div');
						yLabel.style.top = tickTop+'px';
						yLabel.style.width = '100%';
						yLabel.style.display = 'block';
						yLabel.style.position = 'absolute';

					var yTick = document.createElement('div');
						yTick.style.position = 'relative';
						yTick.style.width = chart_meta.yAxis.fontSize+'px';
						yTick.style.backgroundImage = 'url(assets/graphElements/tickline_50px.gif)';
						yTick.style.cssFloat = 'right';
						yTick.style.height = '5px';
						yTick.style.top = '-5px';

					var yTextString = String(l);
					if(l==that.chartMax+1){
						yTextString += chart_meta.yAxis.units_label;
					}

					var yText = returnHandDrawn(yTextString, chart_meta.yAxis.fontSize);
						yText.style.position = 'relative';
						yText.style.display = 'inline';
						yText.style.cssFloat = 'right';
						yText.style.top = -Math.round(chart_meta.yAxis.fontSize/2)+'px';
						
					yLabel.appendChild(yTick);
					yLabel.appendChild(yText);	
					
					yLabels.appendChild(yLabel);
							
				}

			} // end yAxis for loop

			var xAxis = document.createElement('div');
				xAxis.style.backgroundImage = 'url(assets/graphElements/tileLine_300px.gif)';
				xAxis.style.backgroundAttachment = 'fixed';
				xAxis.style.backgroundPosition = 'right top';
				xAxis.style.width = that.axisWidth+5+'px';
				xAxis.style.height = '2px';
				xAxis.style.position = 'absolute';
				xAxis.style.top = that.axisHeight+that.axisIndent[0]+'px';
				xAxis.style.left = that.axisIndent[1]+'px';

			chart_frame.appendChild(xAxis);


			var xLabels = document.createElement('div')
				xLabels.style.width = that.axisWidth+'px';
				xLabels.style.height = that.axisIndent[1]+'px';
				xLabels.style.position = 'absolute';
				xLabels.style.top = that.axisHeight+that.axisIndent[0]+'px';
				xLabels.style.left = that.axisIndent[1]+'px';

			var xAxisDek = returnHandDrawn(chart_meta.xAxis.label,chart_meta.xAxis.fontSize);
				xAxisDek.style.position = 'absolute';
				xAxisDek.style.width = that.axisWidth+'px';
				xAxisDek.style.textAlign = 'center';
				xAxisDek.style.top = (chart_meta.xAxis.fontSize)*2+'px';
	

			xLabels.appendChild(xAxisDek)
			chart_frame.appendChild(xLabels);

			for (var n = 0; n < data_complete.length; n++){

					var tickLeft = 5+(that.x_interval*n);

					var xLabel = document.createElement('div');
						xLabel.style.left = tickLeft+'px';
						xLabel.style.width = that.x_interval+'px';
						xLabel.style.display = 'block';
						xLabel.style.position = 'absolute';

					var xTick = document.createElement('div');
						xTick.style.position = 'absolute';
						xTick.style.backgroundImage = 'url(assets/graphElements/ticklineVert_50px.gif)';
						xTick.style.height = '5px';
						xTick.style.width = '5px';

					var xLabelText = monthNum(data_complete[n].date);
						

					var xText = document.createElement('div');
						xText.style.position = 'absolute';
						xText.style.top = '5px';


					var	xLabelDiv = returnHandDrawn(monthLetter(xLabelText), chart_meta.xAxis.fontSize);
						xLabelDiv.style.display = 'block';

					xText.appendChild(xLabelDiv);
					
					if(xLabelText == 0){
						var xLabelYear = returnHandDrawn(twoDigitYear(data_complete[n].date), chart_meta.xAxis.fontSize);
						xText.appendChild(xLabelYear);
					}


					xLabel.appendChild(xText);	
					xLabel.appendChild(xTick);
					xLabels.appendChild(xLabel);

					var xTextCSS = xText.currentStyle || getComputedStyle(xText,null);
						xText.style.left = -(stripPx(xTextCSS.width)/2)+'px';			

			} // end xAxis for loop


		} // end gif if

	} //end createFrame

	createFrame(allPoints);

	this.addSeries(allPoints);


}

function DataPoint(dataObj, css_class){

		var fontSize = 15;

		this.data = dataObj;

		this.icon = document.createElement('div');
		this.icon.className = css_class;

		var info_label = document.createElement('div');

		var dataTick = document.createElement('div');
			dataTick.style.backgroundImage = 'url(assets/graphElements/ticklineVert_50px.gif)';
			dataTick.style.width = '5px';
			dataTick.style.height = '15px';
			dataTick.style.position = 'absolute';
			dataTick.style.top = '-15px';

		var dataText = dataObj.value;
		if(isNaN(Number(dataObj.units_label))){
			dataText += dataObj.units_label;
		}else{
			dataText = String(Number(dataObj.value)*Number(dataObj.units_label));
		}

		var dataTextDiv = returnHandDrawn(dataText, fontSize);
			dataTextDiv.style.position = 'absolute';
			dataTextDiv.style.top = '-30px';
		var numLetters = String(dataObj.value).length
			dataTextDiv.style.left = -fontSize+'px';
			dataTextDiv.style.width = (numLetters)*fontSize+'px';
		
		info_label.appendChild(dataTick);
		info_label.appendChild(dataTextDiv);

		this.icon.appendChild(info_label);
		info_label.style.display = 'none';

		this.icon.addEventListener("mouseover", this.showData, false);
		this.icon.addEventListener("mouseout", this.hideData, false);

		return (this)

}


DataPoint.prototype.showData = function(e){

	this.children[0].style.display = 'block';

}

DataPoint.prototype.hideData = function(e){

	this.children[0].style.display = 'none';

}


LineChart.prototype.addSeries = function (data_array){

	//first, position series div properly
	var the_series = document.createElement('div');
		the_series.style.width = this.axisWidth+'px';
		the_series.style.height = this.axisHeight+'px';
		the_series.style.position = 'absolute';
		the_series.style.top = this.axisIndent[0]+'px';
		the_series.style.left = this.axisIndent[1]+5+'px';

		

	this.target.appendChild(the_series);
	var numEntries = data_array.length


	for(var g=0; g<numEntries; g++){
		
			var startY = this.axisHeight-Number(data_array[g].value)*this.y_interval;
			var startX = g*this.x_interval;
		if(g < (numEntries-1)){
			var endY = this.axisHeight-Number(data_array[g+1].value)*this.y_interval;
			var endX = (g+1)*this.x_interval;

			var segment = document.createElement('div');
				segment.style.backgroundImage = 'url(assets/graphElements/tileLine_150px.gif)';
				segment.style.backgroundPosition = 'center center';
				segment.style.backgroundAttachment = 'fixed';
				segment.style.height = '5px';

			//need to actually calculate length of hypoteneuse to set width
			var the_width = Math.floor(Math.sqrt(this.x_interval*this.x_interval + (startY-endY)*(startY-endY)));
			segment.style.width = the_width+'px';
			segment.style.top = startY+'px';
			segment.style.left = startX+'px';
			segment.style.position = 'absolute';

			//rotate by angle between points
			this.addRotation(segment, this.findAngle(this.x_interval, endY-startY));

			the_series.appendChild(segment);

		} //end if

		//for each line, add the point
		var data_point = new DataPoint(data_array[g], 'gifCircle');

		var pointCSS = data_point.icon.currentStyle || getComputedStyle(data_point.icon,null);

			data_point.icon.style.top = startY - (stripPx(pointCSS.height)/4)+'px';
			data_point.icon.style.left = startX - (stripPx(pointCSS.width)/2)+'px';

		the_series.appendChild(data_point.icon);

	}

}

LineChart.prototype.addRotation = function (div, degrees){

	div.style.transform = 'rotate('+degrees+'deg)';
	div.style.transformOrigin = '0% 50%';

	div.style.mozTransform = 'rotate('+degrees+'deg)';
	div.style.mozTransformOrigin = '0% 50%';

	div.style.msTransform = 'rotate('+degrees+'deg)';
	div.style.msTransformOrigin = '0% 50%';

	div.style.oTransform = 'rotate('+degrees+'deg)';
	div.style.oTransformOrigin = '0% 50%';

	div.style.webkitTransform = 'rotate('+degrees+'deg)';
	div.style.webkitTransformOrigin = '0% 50%';

}

LineChart.prototype.findAngle = function (x_dist, y_dist){

	return Math.atan2(y_dist,x_dist)*(180/Math.PI);

}


LineChart.prototype.findMax = function(data_array){

		var value_array = [];
		
		for(var i=0; i<data_array.length; i++){
			value_array.push(Number(data_array[i].value));
		}

		
		return(Math.ceil((Array.max(value_array) / 10) * 10))
}

