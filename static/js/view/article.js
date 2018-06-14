define('main/article', ['jquery','main/utils','main/server','main/common','main/temple'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body');
    var tpl = utils.getSearchParam('tpl');
    var id = utils.getSearchParam('id');
    function setContent(html){
        $body.find('.content').html(html);
    }
    // 文章内容
    exports.articleContent = function(tpl){
        if(tpl){
            tpl = window._c.websiteName.toLowerCase() + '_' + tpl;
            utils.TPL.loadTemplates([tpl],function(){
                var html = utils.TPL.get.call(exports.TPL,tpl);
                setContent(html);
                var title = $body.find('.topic').html();
                $body.find('.currentLocation').html(title);
                document.title = title + ' - ' + window._c.websiteName;
            });
        }else if(id === 'contact_us'){
            server.contactInfo(function(data){
                console.log(data)
                var title = 'Contact Us';
                var html = '<h2 class="topic">' + title + '</h2><div class="detail"> '+ data.data.content + '</div>'
                setContent(html);
                $body.find('.currentLocation').html(title);
                document.title = title + ' - ' + window._c.websiteName;
            })
        }else{
            server.newsDetail(id, function(data){
                $body.find('.title').html(data.data.title);
                setContent(data.data.content);
                document.title = data.data.title + ' - ' + window._c.websiteName;
            })
        }
    };
    exports.init = function(){
        common.init();
        common.articleSideBar();
        exports.articleContent(tpl);

    };
    return exports;
})