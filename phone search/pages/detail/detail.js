
var  util = require( '../../utils/util.js' );//AJAX
Page({
    data: {
    	appid : "7001",
        appkey: "cc25c2d4d140f4678bcbc4328003c64a",
    	//产品图轮播速度
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 10000,
        duration: 500,
        circular: true,
        //关联产品点击更多按钮显示消失
        hidden: false,
        
        //数据
        //基本信息
        brief : [],
		//产品图
        focus: [], 
        //关联产品
        series: [],
        series1:[],
        //产品参数
        param : [],
        pageHidden:true,//页面隐藏
//      loaddingHidden:false//loadding
		failhidden:true
    },
    onLoad:function(options){
    	//重新设置标题
    	wx.setNavigationBarTitle({
		  title: '手机详情'
		})
    	
    	//数据请求
    	var that = this;
        var id = options.id;
        var ajaxData = {      
        	'apic' :'Weicode_ProDetail',
        	'pid':id
        }
        
        //加载数据
        ajaxFn(ajaxData,function(){
			//如果失败，再次请求，，再次失败---提示检查网络	
			ajaxFn(ajaxData,function(){	
//				console.log(1)
				that.setData({failhidden:false})				
        	})		
        })	
		function ajaxFn(ajaxData,failFn){
			util.AJAX( ajaxData, function( res ) {
				if(res.errMsg.indexOf('fail')>-1){					
//					that.setData({failhidden:false})
					if(failFn) failFn();					
					return;
				}
//				console.log(2)
	            var arr = res.data.data;
				//焦点图的话处理长度
				if(arr.focus.length>6){
					arr.focus.length=6;
				}
				//处理产品参数换行问题
				for(var i=0;i<arr.param.length;i++){
					for(var j=0;j<arr.param[i].speparam.length;j++){
						var searhN = arr.param[i].speparam[j].value;
						if(searhN.indexOf('\\n')!=-1){
							arr.param[i].speparam[j].value = searhN.replace(/\\n/g, "\n")
						}
					}
				}
	//          // 重新写入数据
	            that.setData({
	                brief : arr.brief,//基本信息
	                focus : arr.focus,//产品图
	                series: arr.series,//关联产品
	                series1: arr.series.slice(0,4),//关联产品单独处理
	                param : arr.param,//产品参数 
	                pageHidden : false//页面隐藏	                
	            });           
	            	            
	        });
		}
    },
    //图片
    changeIndicatorDots: function (e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeVertical: function (e) {
        this.setData({
            vertical: !this.data.vertical
        })
    },
    changeAutoplay: function (e) {
        this.setData({
            autoplay: !this.data.autoplay
        })
    },
    intervalChange: function (e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange: function (e) {
        this.setData({
            duration: e.detail.value
        })
    },
    //产品关联点击更多按钮点击
    offerMore:function(){
    	this.setData({
            hidden: true,
            series1: this.data.series
        })
    },
    //分享
//	onShareAppMessage: function () {
//	    return {
//	      title: '手机中国',
//	      desc: '自定义分享描述',
//	      path: '/pages/index/index'
//	    }
//	}
})