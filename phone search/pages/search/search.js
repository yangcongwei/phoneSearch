var  util = require( '../../utils/util.js' );//AJAX
Page({
	data:{
		hidden: true,
		inputValue:"",
		datalistInput:[],//输入中请求回来的数据
		datalist:[],//请求回来的数据
		listhidden:true,//未搜索到
		searhhidden:true,//页面显示
//		loadinghidden:true//加载中
		failhidden:true
	},
	/*页面初始化*/
	onLoad:function(){
		
	},
	//开始输入内容
	bindKeyInput:function(e){
		var that = this;
		var value = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
		if(value=="") return; 
	    that.dataAjax(value,0)
	},
	
	//点击完成按钮
	bindconfirm:function(e){
		var that = this;
		var value = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
		if(value=="") return;
		that.setData({
			failhidden:true,
			hidden: true
		})
		wx.showToast({
		  title: '加载中',
		  icon: 'loading',
		  duration: 10000
		})
		
		that.dataAjax(value,1,function(){
			//如果失败再次发送请求
			that.dataAjax(value,1,function(){
				wx.hideToast()
				that.setData({
					failhidden:false,
					searhhidden :true
				})
			})
		})
	},
	//点击取消按钮
	navigateBack: function () {
	    wx.navigateBack()
	},
	//点击删除搜索按钮
	searchClose:function(){
		this.setData({
			hidden: true,
			datalistInput:[],
			searhhidden :true,
			datalist:[]
		})
		wx.hideToast()
	},
	
	/**数据请求封装**/
    dataAjax:function(val,num,failFn){
    	/*num如果是1的话说明是点击完成的搜索，如果是0的话，是在输入中的搜索*/
    	var that = this;
        var ajaxData = {
        	'apic' : 'Weicode_SearchPro',
        	'q' : val
        }
        util.AJAX( ajaxData, function( res ) {
			if(res.errMsg.indexOf('fail')>-1){					
//				that.setData({failhidden:false})
				if(failFn) failFn();					
				return;
			}
            var arr = res.data.data;
            wx.hideToast()			
			if(num==1){
				if(res.data.code==1001){
	        		that.setData({
	        			listhidden:true,
	        			inputValue: val,
	        			failhidden:true,
	        			searhhidden :false,
	        			hidden: true
	        		})
	        	}else{
	        		that.setData( {
						hidden: true,//搜索列表隐藏
						listhidden:false,
						failhidden:true,
						searhhidden :false,
						datalist:arr,  // 存储数据
	//					dataHoteLength: arr.length,//请求过来的条数
	//					dataHotePage: that.data.dataHotePage + 1// 统计加载次数
			        });
	        	}
				
			}else{
				if(res.data.code==1001){
	        		that.setData({   			
	        			hidden: true,
	        		})
	        	}else{
	        		that.setData( {
						hidden: false,//搜索列表隐藏
						datalistInput: arr,  // 存储数据
	//					dataHoteLength: arr.length,//请求过来的条数
	//					dataHotePage: that.data.dataHotePage + 1// 统计加载次数
			        });
	        	}
				
			}
        });
    }
})