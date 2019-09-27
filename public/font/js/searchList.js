// import { template } from "handlebars";

$(function(){
  // 获取地址栏传递过来的关键字  设置给 input
  var key = getSearch("key");
  // 设置给 input
  $(".search_input").val(key);
 //已进入页面  渲染一次
 render();

  // 已进入页面  根据搜索关键字  发送请求进行页面渲染
  function render(){
    // 准备请求数据
    var params = {};
    // 三个比传的参数
    params.proName = $('.search_input').val();
    params.page = 1;
    params.pageSize = 100;
    // 两个可传和不可传的参数
    //  1需要根据高亮  a 来判断传那个参数 
    //  2通过箭头判断  升序还是降序
    //   价格 price     1 升序 2 降序
    //   库存 num     1 升序 2 降序

    var $current = $('.lt_sort a.current');
    if($current.length > 0){
      // 有高亮的a  说明需要进行排序
      // 获取传给后台的健
      var  sortName =$current.data("type");
      // 获取传递给后台的值  通过箭头方向判断
      var sortValue = $current.find("i").hasClass(" fa-angle-down") ? 2 : 1;
      // 添加到params 中
      params[sortName] = sortValue;
    }
    setTimeout(function(){

      $.ajax({
        type:"get",
        url:"/product/queryProduct",
        data:params,
          
        
        dataType:"json",
        success:function(info){
          console.log(info);
        var htmlStr = template("proudectTpl",info);
        $(".lt_product").html(htmlStr);
        }
      });
    },500);
  }
  // 功能2 点击搜索按钮  实现搜索功能
  $(".search_btn").click(function(){
    // 需要将搜索关键字  追加存储到本地存储中
    var  key  = $('.search_input').val();
    if(key.trim() === ""){
      mui.toast("请输入搜索关键字");
      return;
    }
    render();
    // 获取数组 需要将 jsonStr =》 arr
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);
    //  1 删除重复的项
     var index = arr.indexOf(key);
     if(index != -1){
       arr.splice(index,1);
     }
    //  2 长度限制在  10
    if (arr.length >= 10){
      // 删除最后一项
      arr.pop();
    }

    // 将关键字追加到 arr最前面
    arr.unshift(key);
    // 转成json 存到本地中
    localStorage.setItem("search_list",JSON.stringify(arr));
  });

  //  功能3 排序功能
  // 通过属性选择器给价格好库存添加点击事件
  //  1 如果自己有 current 类 切换箭头方向
  //  2 如果自己没有 current 类 给自己加上current类移除兄弟元素 current
  $('.lt_sort a[data-type]' ).click(function(){
    // hasClass 检查当前的元素是否含有某个特定的类，如果有，则返回true
    if($(this).hasClass("current")){
      // 有 切换箭头
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    }
    else{
      // 没有自己加上current 移除兄弟元素
      $(this).addClass("current").siblings().removeClass("current");
    }
    // 页面重新渲染即可  因为所有的参数都在render中实时获取处理好了
    //  重新渲染  只需要调用 render
    render();
  });
});