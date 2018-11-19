
var  util = require( '../../utils/util.js' );//AJAX
Page( {
    data: {
        /* 页面配置*/
        winWidth: 0,
        winHeight: 0,
       
        currentTab: 0, // tab切换
        listorder : 0, //价格正序倒序
        page : 1,//当前页面
        /*数据*/
        // 热门数据
        dataHote : [],
        dataHoteLength: 0,//请求过来的条数
        dataHotePage: 1,//当前页面
        hothidden: true,// 显示加载更多 loading
        // 最新数据
        dataNew : [],
        dataNewLength: 0,//请求过来的条数
        dataNewPage: 1,//当前页面
        newhidden: true,// 显示加载更多 loading
        // 价格数据
        dataMoney : [],
        dataMoneyLength: 0,//请求过来的条数
        dataMoneyPage: 1,//当前页面
        moneyhidden: true,// 显示加载更多 loading
        
        hidden: true,// loading
        wifihidden:false//网络不可用
    },
//	//分享
//	onShareAppMessage: function () {
//	    return {
//	      title: '手机中国',
//	      desc: '自定义分享描述',
//	      path: '/pages/index/index'
//	    }
//	},
    /** 
     * 页面初始化
     * options 为页面跳转所带来的参数
     */
    onLoad: function( options ) {
    	
        var that = this;    
        
        /**获取系统信息*/
        wx.getSystemInfo( {
            success: function( res ) {
                that.setData( {
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
        
        /**显示loading*/
        that.setData( {
            hidden: false
        });
        
        /**请求热门数据*/
        that.dataAjax(1,function(){
        	that.dataAjax(1,function(){
        		that.setData({wifihidden:true});
        	})
        })
//      var ajaxData = {
//      	'apic' : 'Weicode_ProList',
//      	't':1
//      }
//      util.AJAX( ajaxData, function( res ) {			
//          var arr = res.data.data;
//          // 重新写入数据
//          that.setData({
//              dataHote: arr,
//              dataHoteLength: arr.length,//请求过来的条数
//              dataHotePage: that.data.dataHotePage + 1 // 统计加载次数
//          });
//      });
    },
    onReady: function() {
    	  // 页面渲染完成
        var that = this;
        // 数据加载完成后 延迟隐藏loading
        setTimeout( function() {
            that.setData( {
                hidden: true
            })
        }, 500 );


    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },


    /**
     * 事件处理
     * scrolltolower 自动加载更多
     */
    scrolltolower: function( e ) {
        var that = this;      
        if(that.data.page==1){
        	// 加载更多 loading
        	that.setData({
        		hothidden: true,
        		wifihidden: false
        	})
        	 // 如果加载数据超过10条
        	if(this.data.dataHoteLength < 10){
        		that.setData({hothidden: false})
        	}else{
        		 /**发送请求数据*/
        		that.dataAjax(that.data.page,function(){
        			that.setData({wifihidden:true});
        		})
        	}
        }else if(that.data.page==2){
        	that.setData({
        		newhidden: true,
        		wifihidden: false
        	})
        	if(this.data.dataNewLength < 10){
        		that.setData({newhidden: false})
        	}else{
        		that.dataAjax(that.data.page,function(){
        			that.setData({wifihidden:true});
        		})
        	}
        }else{
        	that.setData({
        		moneyhidden: true,
        		wifihidden: false
        	})
        	if(this.data.dataMoneyLength < 10){
        		that.setData({moneyhidden: false})
        	}else{
        		that.dataAjax(that.data.page,function(){
        			that.setData({wifihidden:true});
        		})
        	}
        }                
    },
    /**
     * 滑动切换tab
     */
    bindChange: function( e ) {
        var that = this;       
        that.setData( { 
        	currentTab: e.detail.current,
        	wifihidden: false
        });
        //如果点击的是价格并且是第一次点击，发送请求
        if(e.detail.current==2){
        	if(that.data.listorder==0){
        		that.setData({page:3});
        	}else{
        		that.setData({page:4});
        	}
        	if(that.data.dataMoney.length==0){
        		that.dataAjax(that.data.page,function(){
        			//如果加载失败--再次加载,再次失败--提示
        			that.dataAjax(that.data.page,function(){
        				that.setData({wifihidden:true});
        			})
        		})
        	}        	
        }else{
        	//如果点击的是新品并且是第一次点击，发送请求
        	that.setData({ page: e.detail.current+1});
        	if(e.detail.current==1 && that.data.dataNew.length==0){
        		that.dataAjax(that.data.page,function(){
        			//如果加载失败--再次加载,再次失败--提示
        			that.dataAjax(that.data.page,function(){
        				that.setData({wifihidden:true});
        			})
        		})
        	}else if(e.detail.current==0 && that.data.dataHote.length==0){
        		that.dataAjax(that.data.page,function(){
        			//如果加载失败--再次加载,再次失败--提示
        			that.dataAjax(that.data.page,function(){
        				that.setData({wifihidden:true});
        			})
        		})
        	}
        }
    },
    /**点击tab切换**/
    swichNav: function( e ) {
        var that = this;
        if( this.data.currentTab == e.target.dataset.current ) {
        	//如果是第三个价钱点击切换单独处理
        	
        	if(this.data.currentTab=="2"){
        		//重置数据
        		that.setData( {
	                dataMoney: [], 
	                dataMoneyLength: 0,
	                dataMoneyPage: 1,
	                wifihidden: false
	            });
        		//如果点击价格
        		if(that.data.listorder==0){
        			var num = 1;
        			that.setData( {           	
		                currentTab: e.target.dataset.current,
		                page : 4
		            })
        			that.dataAjax(that.data.page,function(){
        				//如果加载失败--再次加载,再次失败--提示
	        			that.dataAjax(that.data.page,function(){
	        				that.setData({wifihidden:true});
	        			})
        			})
        		}else{
        			var num = 0;
        			that.setData( {           	
		                currentTab: e.target.dataset.current,
		                page : 3
		            })
        			that.dataAjax(that.data.page,function(){
        				//如果加载失败--再次加载,再次失败--提示
	        			that.dataAjax(that.data.page,function(){
	        				that.setData({wifihidden:true});
	        			})
	        		})
        		}
        		that.setData( {           	
	                listorder: num
	            })        		
        	}
            return false;
        }else {
            that.setData( {           	
                currentTab: e.target.dataset.current,
            })
        }
    },
    /**点击进入搜索页面**/
    searchOpen:function(){   	
    	wx.navigateTo({
	      url: '../search/search'
	    })
    }, 
    /**点击导航数据请求封装**/
    dataAjax:function(nav,failFn){
    	var that = this;
    	switch(nav){
	    		case 1: 
	    			var page = that.data.dataHotePage;
	    			break;
	    		case 2: 
	    			var page = that.data.dataNewPage;
	    			break;
	    		case 3: 
	    			var page = that.data.dataMoneyPage;
	    			break;
	    		case 4: 
	    			var page = that.data.dataMoneyPage;
	    			break;
	    	}
        var ajaxData = {
        	'apic' : 'Weicode_ProList',
        	't' : nav,
        	'p' : page
        }
        util.AJAX( ajaxData, function( res ) {
        	if(res.errMsg.indexOf('fail')>-1){
				if(failFn) failFn();					
				return;
			}
            var arr = res.data.data;				
			switch(nav){
				case 1://热门 
					// 获取当前数据进行保存
					var list = that.data.dataHote;
					// 然后重新写入数据
		            that.setData( {
		                dataHote: list.concat( arr ),  // 存储数据
		                dataHoteLength: arr.length,//请求过来的条数
		                dataHotePage: that.data.dataHotePage + 1// 统计加载次数
		            });
					break;
				case 2://最新
					var list = that.data.dataNew;
		            that.setData( {
		                dataNew: list.concat( arr ), 
		                dataNewLength: arr.length,
		                dataNewPage: that.data.dataNewPage + 1
		            });
					break;
				case 3://价格高到低						
					var list = that.data.dataMoney;						
		            that.setData( {
		                dataMoney: list.concat( arr ),
		                dataMoneyLength: arr.length,
		                dataMoneyPage: that.data.dataMoneyPage + 1
		            });
					break;
				case 4://价格低到高
					var list = that.data.dataMoney;
		            that.setData( {
		                dataMoney: list.concat( arr ), 
		                dataMoneyLength: arr.length,
		                dataMoneyPage: that.data.dataMoneyPage + 1
		            });
					break;
			}
            
        });
    }
})


	

