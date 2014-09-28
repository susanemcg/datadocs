$(function () {
        $('#container').highcharts({
            chart: {
                type: 'line',
                marginRight: 40               
            },

                        
            title: {
                text: '',
                style: {
                  align:'left',
                  color:'#677279',
                  font: 'normal 20px font-family: "BebasNeue", Helvetica, Arial, sans-serif'
              },
            },


            xAxis: {
                
                categories: [
                                '   Jan-05  '   ,
                                '   Feb-05  '   ,
                                '   Mar-05  '   ,
                                '   Apr-05  '   ,
                                '   May-05  '   ,
                                '   Jun-05  '   ,
                                '   Jul-05  '   ,
                                '   Aug-05  '   ,
                                '   Sep-05  '   ,
                                '   Oct-05  '   ,
                                '   Nov-05  '   ,
                                '   Dec-05  '   ,
                                '   Jan-06  '   ,
                                '   Feb-06  '   ,
                                '   Mar-06  '   ,
                                '   Apr-06  '   ,
                                '   May-06  '   ,
                                '   Jun-06  '   ,
                                '   Jul-06  '   ,
                                '   Aug-06  '   ,
                                '   Sep-06  '   ,
                                '   Oct-06  '   ,
                                '   Nov-06  '   ,
                                '   Dec-06  '   ,
                                '   Jan-07  '   ,
                                '   Feb-07  '   ,
                                '   Mar-07  '   ,
                                '   Apr-07  '   ,
                                '   May-07  '   ,
                                '   Jun-07  '   ,
                                '   Jul-07  '   ,
                                '   Aug-07  '   ,
                                '   Sep-07  '   ,
                                '   Oct-07  '   ,
                                '   Nov-07  '   ,
                                '   Dec-07  '   ,
                                '   Jan-08  '   ,
                                '   Feb-08  '   ,
                                '   Mar-08  '   ,
                                '   Apr-08  '   ,
                                '   May-08  '   ,
                                '   Jun-08  '   ,
                                '   Jul-08  '   ,
                                '   Aug-08  '   ,
                                '   Sep-08  '   ,
                                '   Oct-08  '   ,
                                '   Nov-08  '   ,
                                '   Dec-08  '   ,
                                '   Jan-09  '   ,
                                '   Feb-09  '   ,
                                '   Mar-09  '   ,
                                '   Apr-09  '   ,
                                '   May-09  '   ,
                                '   Jun-09  '   ,
                                '   Jul-09  '   ,
                                '   Aug-09  '   ,
                                '   Sep-09  '   ,
                                '   Oct-09  '   ,
                                '   Nov-09  '   ,
                                '   Dec-09  '   ,
                                '   Jan-10  '   ,
                                '   Feb-10  '   ,
                                '   Mar-10  '   ,
                                '   Apr-10  '   ,
                                '   May-10  '   ,
                                '   Jun-10  '   ,
                                '   Jul-10  '   ,
                                '   Aug-10  '   ,
                                '   Sep-10  '   ,
                                '   Oct-10  '   ,
                                '   Nov-10  '   ,
                                '   Dec-10  '   ,
                                '   Jan-11  '   ,
                                '   Feb-11  '   ,
                                '   Mar-11  '   ,
                                '   Apr-11  '   ,
                                '   May-11  '   ,
                                '   Jun-11  '   ,
                                '   Jul-11  '   ,
                                '   Aug-11  '   ,
                                '   Sep-11  '   ,
                                '   Oct-11  '   ,
                                '   Nov-11  '   ,
                                '   Dec-11  '   ,
                                '   Jan-12  '   ,
                                '   Feb-12  '   ,
                                '   Mar-12  '   ,
                                '   Apr-12  '   ,
                                '   May-12  '   ,
                                '   Jun-12  '   ,
                                '   Jul-12  '   ,
                                '   Aug-12  '   ,
                                '   Sep-12  '   ,
                                '   Oct-12  '   ,
                                '   Nov-12  '   ,
                                '   Dec-12  '   ,
                                '   Jan-13  '   ,
                                '   Feb-13  '   ,
                                '   Mar-13  '   ,
                                '   Apr-13  '   ,
                                '   May-13  '   ,
                                '   Jun-13  '   ,
                                '   Jul-13  '   ,
                                '   Aug-13  '   ,
                                '   Sep-13  '   ,
                                '   Oct-13  '   ,
                                '   Nov-13  '   ,
                                '   Dec-13  '   ,
                                '   Jan-14  '   ,
                                '   Feb-14  '   
                            ],

                labels: {
                    style: {
                        color: '#5e5e5e',
                        align: 'center',
                        font: 'normal 12px Helvetica, Arial, sans-serif'
                    },
                    rotation: 45
                },

                minTickInterval: 13

            },


            yAxis: {
                min: 0,
                title: {
                    text: '',
                },


                labels: {
                    style: {
                        color: '#5e5e5e',
                        align: 'center',
                        font: 'normal 12px Helvetica, Arial, sans-serif'
                    }
                }

            },

            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true,
                borderWidth: 0,
                itemStyle:{
                    color: '#5e5e5e',
                    align: 'center',
                    font: 'normal 12px Helvetica, Arial, sans-serif'
                }

            },


            tooltip: {
                               
                formatter: function(){
                    var tooltip_content = '<div><span style = "font-family: Helvetica, Arial, sans-serif">' + this.x.replace('\'9','199').replace('\'0', '200').replace('\'1', '201') + '</span></div><div style = "font-family: Helvetica, Arial, sans-serif"><span style="color:'+ this.series.color +'; font-family: Helvetica, Arial, sans-serif">'  + this.series.name + '</span>: ' + this.y + ' percent</div>';
                    return tooltip_content;
                },
                useHTML: true,
                borderRadius: 0,
                shadow: false,
                borderColor: '#797F85',
            },

            plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
            },
          
            series: [{
                name: 'Official unemployment rate',
                data: [5.3,5.4,5.2,5.2,5.1,5.0,5.0,4.9,5.0,5.0,5.0,4.9,4.7,4.8,4.7,4.7,4.6,4.6,4.7,4.7,4.5,4.4,4.5,4.4,4.6,4.5,4.4,4.5,4.4,4.6,4.7,4.6,4.7,4.7,4.7,5.0,5.0,4.9,5.1,5.0,5.4,5.6,5.8,6.1,6.1,6.5,6.8,7.3,7.8,8.3,8.7,9.0,9.4,9.5,9.5,9.6,9.8,10.0,9.9,9.9,9.7,9.8,9.9,9.9,9.6,9.4,9.5,9.5,9.5,9.5,9.8,9.4,9.1,9.0,9.0,9.1,9.0,9.1,9.0,9.0,9.0,8.8,8.6,8.5,8.2,8.3,8.2,8.2,8.2,8.2,8.2,8.1,7.8,7.8,7.8,7.9,7.9,7.7,7.5,7.5,7.5,7.5,7.3,7.2,7.2,7.2,7.0,6.7,6.6,6.7], 
                color: '#F563F1'
            }]

        });
    });
    
