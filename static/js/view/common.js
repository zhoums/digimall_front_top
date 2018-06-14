define('main/common', ['jquery','main/utils','main/server','main/temple','jqui'], function($, utils, server, temple, jqui){

    var exports = {},
    path  = window._c.path,
    isLogin = 0,
    $body   = $('body'),


    path = window._c.path,
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    isSend = false;
    function quickInquiry(){
        var $name = $body.find('#quick_inquiry_name');
        var $email = $body.find('#quick_inquiry_email');
        var $kaptcha = $body.find('#kaptcha');
        var $content = $body.find('#quick_inquiry_content');
        var $error = $body.find('.quickInquiryContainer .error_msg');
        var oData = {};
        oData.name = $name.val();
        if($.trim(oData.name) == ''){
            $name.focus();
            $error.text("Please enter your name.");
            return false;
        }
        oData.email = $email.val();
        if($.trim(oData.email) == '' || !rExpEmail.test(oData.email)){
            $email.focus();
            $error.text("Please enter correct email.");
            return false;
        }
        oData.kaptcha = $kaptcha.val();
        if($.trim(oData.kaptcha) == '' || oData.kaptcha.length != 4){
            $kaptcha.focus();
            $error.text("Please enter authcode.");
            return false;
        }
        // oData.kaptcha = '110ee873d70440eb80b10315e23661cf';
        oData.lookingFor = $content.val();
        if($.trim(oData.lookingFor) == ''){
            $content.focus();
            $error.text("Please enter looking for.");
            return false;
        }
        // oData.kaptcha = $.md5(oData.kaptcha);
        if(isSend) return false;
        isSend = true;
        server.quickInquiry(oData,function(data){
            $name.val('');
            $email.val('');
            $kaptcha.val('');
            $content.val('');
            $error.text('');
            $("#quickInquiry").dialog("close");
            utils.tips('submit success');
            isSend = false;
            $body.find('.kaptcha').attr('src',path+'kaptcha.wb?t='+Math.random());
        },function(data){
            $error.text(data.msg);
            isSend = false; 
        });

    };
    
    // 头部-用户登录模块
    function setLoiginSiteNav(data){
        var html = '';
        if(isLogin === 1){
            // html = '<span style="margin:5px;">Hello! Welcome to ' + window._c.websiteName + '!</span>' +
            //     ' <a href="/member/index.html" id="aLogin">'+(data.realname || data.account)+'</a>' +
            //     '<a href="/member/logout.html" id="aLogout">Logout</a>';
            // $body.find('.topSum').html(html);    
            html = '<a href="/member/index.html" id="aLogin">'+(data.realname || data.account)+'</a>/' +
                '<a href="/member/logout.html" id="aLogout">Logout</a>';
            $body.find('.topLogin').html(html);
        }
        // else{
        //     html = 'Hello! Welcome to ' + window._c.websiteName + '!';
        //     $body.find('.topSum span').html(html);
        //     $body.find('.logout').remove();
        // }
    };
    // function hasLoadedSiteNav(data){
    //     if($body.find('.topSum').length && isLogin !== 0 ){
    //         setLoiginSiteNav(data);
    //     }else{
    //         setTimeout(function(){
    //             hasLoadedSiteNav(data);
    //         },500);
    //     }
    // }
    //渲染购物车样式
    function setHeadShopCart(data){
        if(data.length){//头部购物车样式
            // $body.find('.topCart').addClass('redBg');
            $body.find('#ShoppingCart').html(temple.headShopCart(data));
            $body.find('.topCart .shop_cart span').html(data.length);
        }
    }
    //判断头部购物车是否清空
    function isEmptyHeadShopCart(){
        var $ShoppingCart = $body.find('#ShoppingCart');
        if(!$ShoppingCart.find('.blockItem').length){
            // $body.find('.topCart').removeClass('redBg');
            $ShoppingCart.html('<li class="emptyCart"><a href="/product/index.html">Shopping Cart empty Oh! Just try to find sth</a></li>');
        }
    }

    function handlerKeyup(e) {
        if (e.keyCode === 13) {
            search();
        }
    }

    function bindKeyEvent() {
        $("#btn-search").on("click",search);
        try{
            document.getElementById('searchInput').addEventListener('keyup', handlerKeyup, false);
        }catch(e){
            document.getElementById('searchInput').attachEvent('onkeyup', handlerKeyup, false);
        }
    }

    function search(){
        var searchType = $body.find('.sele').attr('v');
        var searchValue = $body.find('#searchInput').val();
        if(searchValue.length <= 3){
            utils.tips('Key words need to be more precise!');
            return false;
        }
        if(searchType === 'Products'){
            window.location.href = '/product/search.html?key='+searchValue;
        }else{
            window.location.href = '/datasheet/index.html?key='+searchValue;
        }
    }
    //重置title
    exports.setPageTitle = function(){
        document.title = document.title + ' - ' + window._c.websiteName;
    };
    // // 导航栏
    // exports.siteNav = function(){
    //     // utils.TPL.loadTemplates(['site_nav'],function(){        
    //     //     var html = utils.TPL.get.call(exports.TPL,'site_nav');
    //     //     $body.find('#site-nav').html(html);
    //     // });
    //     var html = temple.siteNavHtml();
    //     $body.find('#site-nav').html(html);
    // };
    // 头部
    exports.header = function(){
        var url = window.location.pathname;
        if(url === '/article/about.html'){
            url += '?tpl=about_us';
        }
        var $header = $body.find('#header');
        $header.find('.navTab[href="'+url+'"]').addClass('highlight');
        exports.homeCagtegory();
        utils.TPL.loadTemplates(['header'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'header');
            $header.append(html);
            exports.inquiryDialog($('#quickInquiry'));
            // exports.headShopCart();
        });
    };
    // Category列表callback
    function homeCagtegoryCbf(data){
        var html = temple.homeCagtegory(data.categories);
        $body.find('.categoryList').html(html.cagtegoryHtml);
        $body.find('.categoryList').after(html.subCagtegoryHtml);
    }
    // Category列表
    exports.homeCagtegory = function(){
        var homeCagtegoryInfo = utils.STORE.getItem('homeCagtegoryInfo');
        if(homeCagtegoryInfo){
            homeCagtegoryCbf(homeCagtegoryInfo);
        }else{
            server.homeCagtegory(function(data){
                data = data.data;
                utils.STORE.setItem('homeCagtegoryInfo',data, 1*60*60*1000);
                homeCagtegoryCbf(data);
                // var html = temple.homeCagtegory(data.categories);
                // $body.find('.categoryList').html(html.cagtegoryHtml);
                // $body.find('.categoryList').after(html.subCagtegoryHtml);
            });
        }
    };
    // 尾部
    exports.footer = function(){
        utils.TPL.loadTemplates(['footer'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'footer');
            $body.find('#footer').html(html);
            exports.headShopCart();
        });
    };
    exports.siteMap = function(){
        $body.find('.siteMap').html('<a href="/">Home</a> &gt; <span class="currentLocation"></span>');
    };
    // 个人中心左侧栏
    exports.userSideBar = function(){
        utils.TPL.loadTemplates(['user_side_bar'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'user_side_bar');
            $body.find('.sidebar').html(html);
            var url = window.location.pathname;
            $body.find('.oneMenuItem[href="'+url+'"]').addClass('select');
            // select
        });
    };
    // 文章左侧栏
    exports.articleSideBar = function(){
        utils.TPL.loadTemplates(['article_site_bar'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'article_site_bar');
            $body.find('.sidebar').html(html);
            var url = window.location.pathname;
            $body.find('.oneMenuItem[href="'+url+'"]').addClass('select');
            // select
        });
    };

    //已登录callback
    function hasLoginCbf(data){
        isLogin = 1;
        setLoiginSiteNav(data);
    }
    //获取登录信息
    exports.isLogin = function(isNeedLogin){
        var loginInfo = utils.STORE.getItem('loginInfo');
        if(loginInfo){
            // console.log(loginInfo);
            hasLoginCbf(loginInfo);
        }else{

            server.loginInfo(function(data){
                // console.log(data);
                utils.STORE.setItem('loginInfo',data.data, 0.5*60*60*1000);
                hasLoginCbf(data.data);
            },function(data){
                isLogin = -1;
                if(isNeedLogin){
                    window.location.href = '/member/login.html?redirect_url='+window.location.pathname+window.location.search;
                }
                setLoiginSiteNav();
            });
        }
    };

    // 获取购物车数据
    exports.headShopCart = function(){
        if(!isLogin){
            setTimeout(function(){
                exports.headShopCart();
            },500);
        }else{
            if(isLogin === 1){//已登录，则请求购物车数据
                server.myShopCart({
                    size: 50,
                    index: 1
                },function(data){
                    if(data.data){
                        setHeadShopCart(data.data);
                    }
                });
            }else if(isLogin === -1){//未登录，则读取缓存数据
                var data = utils.STORE.getItem('unloginShopCart') || [];
                setHeadShopCart(data);
            }
        }
    };
    //添加购物车
    exports.addShopCart = function(oData,unloginCbf,cbf){
        if(isLogin === 1){
            //已登录，添加购物车
            server.addShopCart(oData,function(data){
                exports.headShopCart();
                cbf();
            },function(data){
                utils.tips(data && data.msg || 'fail!');
            });
        }else if(isLogin === -1){
            //未登录，缓存本地
            unloginCbf();
            setTimeout(function(){
                exports.headShopCart();
                cbf();
            },500);//本地缓存数据需要时间
        };
    };

    // 删除购物车
    exports.deleteShopCart = function(id,obj,index){
        var params = {
            id: id
        };
        if(isLogin === 1){
            server.deleteShopCart(params,function(data){
                utils.tips('success');
                obj.remove();
                exports.refreshShopCartCount();
            },function(data){
                utils.tips(data.msg);
            });
        }else if(isLogin === -1){
            var shopCartArray = utils.STORE.getItem('unloginShopCart') || [];
            shopCartArray.splice(id,1);
            utils.STORE.setItem('unloginShopCart',shopCartArray);
            utils.tips('success');
            obj.remove();
            var newLiList=$('#ShoppingCart li').not('.CartGoto');
            $.each(newLiList,function(i,item){
                $(item).attr('_id',i);
            })
            exports.refreshShopCartCount();
        };
    }
    exports.refreshShopCartCount = function(count){
        count = count || 1;
        var $ShopCartCount = $body.find('.topCart .shop_cart span');
        var num = parseInt($ShopCartCount.html());
        $ShopCartCount.html(num-count);
        isEmptyHeadShopCart();
    };
    exports.inquiryDialog = function(dialogObj){
        dialogObj.dialog({
          autoOpen: false,
          modal: true,
          width: 600
        });
    }
    exports.sureDialog = function(dialogObj,cbf){
        dialogObj.dialog({
          autoOpen: false,
          modal: true,
          buttons : {
            "Confirm" : function() {
                cbf();
              // exports.deleteDeliveryAddress();
                $(this).dialog("close");
            // },
            // "Cancel" : function() {
            //     $(this).dialog("close");
            }
          }
        });
    }
    //  显示哪个分类
    function showCategoryList(index){
        $body.find('.categoryList li').removeClass('categorySelect').eq(index).addClass('categorySelect');
        $body.find('.subCategoryList').hide().eq(index).show();
    }
    // 事件
    exports.action = function(){
        $body.on('mouseover','.topMenu .item',function(){
            var ul = this.getElementsByTagName("ul")[0];
            if(ul){
                ul.style.display = "block";
                this.style.backgroundColor = "#e5e5e5";
                this.onmouseout = function () {
                    ul.style.display = "none";
                    this.style.backgroundColor = '';
                }  
            }
        }).on('mouseover','.proCate',function(){
            $('.proCate').css('backgroundColor','#e5e5e5');
            $body.find('.top .categoryContainer').show();
            // $body.find('.proCate i').removeClass('down').addClass('up');
            showCategoryList(0);
        }).on('mouseover','.categoryList li',function(){
            var index = $(this).index('.categoryList li');
            showCategoryList(index)
        }).on('mouseleave','.categoryWrapper',function(){
            $body.find('.top .categoryContainer').hide();
            $('.proCate').css('backgroundColor','');
            // $body.find('.proCate i').removeClass('up').addClass('down');
        }).on('mouseover','.topCart',function(){
            this.style.backgroundColor = "#e5e5e5";
            $body.find('.cart').show();
        }).on('mouseleave','.topCart',function(){
            $body.find('.topCart').css('backgroundColor', '');
            $body.find('.cart').hide();
        }).on('click','.tabSearch,.searchSubmit,.headDeleteShopCartBtn,.needLogin,.quickInquiry,.quickInquirySubmit,.kaptcha,.floatWrapper .displayBtn',function(){
            var self = $(this);
            var index;
            if(self.hasClass('tabSearch')){//头部切换搜索
                index = self.index('.tabSearch');
                self.addClass('sele').siblings().removeClass('sele');
                // $body.find('.searchType').html(self.attr('v'));
            }else if(self.hasClass('headDeleteShopCartBtn')){//头部购物车
                var itemObj = self.closest('.blockItem');
                var id = itemObj.attr('_id');
                exports.deleteShopCart(id,itemObj);
            }else if(self.hasClass('needLogin')){//点击链接，判断是否需要登录
                if(isLogin === 1){
                    window.location.href = self.attr('link');
                }else{
                    window.open('/member/login.html?redirect_url='+self.attr('link'));
                }
            }else if(self.hasClass('quickInquiry')){//弹出quick inquiry popup
                $body.find('.kaptcha').attr('src',path+'/kaptcha.wb');
                $("#quickInquiry").dialog("open");
            }else if(self.hasClass('quickInquirySubmit')){//提交quick inquiry
                quickInquiry();
            }else if(self.hasClass('kaptcha')){//图片验证码 
                self.attr('src',path+'kaptcha.wb?t='+Math.random());
            }else if(self.hasClass('displayBtn')){
                if(self.find('i').hasClass('up')){
                    self.siblings('.applictionContainer').hide();
                    self.find('i').removeClass('up').addClass('down').closest('a');
                }else{
                    self.siblings('.applictionContainer').show();
                    self.find('i').removeClass('down').addClass('up').closest('a');
                }
            }
        });


    };

    // 返回头部
    exports.back = function(){
        
    };

    exports.init = function(isNeedLogin){
        isNeedLogin = isNeedLogin || '';
        exports.isLogin(isNeedLogin);
        // exports.siteNav();
        exports.header();
        exports.siteMap();
        exports.footer();
        exports.setPageTitle();
        exports.action();
        bindKeyEvent();
    };

    return exports;
})