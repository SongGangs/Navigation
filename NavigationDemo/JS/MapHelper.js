var point = new BMap.Point(116.331398, 39.897445);
Window.MyMap.centerAndZoom(point, 12); // 初始化地图,设置中心点坐标和地图级别。
G("LocationCity").innerHTML = "北京市";
G("CurCityLabel").innerHTML = "北京市";
//根据IP定位城市所在地
function f(result) {
    var cityName = result.name;
    Window.MyMap.setCenter(cityName);
    G("LocationCity").innerHTML = cityName;
    G("CurCityLabel").innerHTML = cityName;
    G("statusbar").innerHTML = "当前城市：" + cityName;
}
var myCity = new BMap.LocalCity();
myCity.get(f);


///设置几个mark的全局变量！
var mark_startP, mark_endP, mark_location;

Window.MyMap.enableScrollWheelZoom(); //启用滚轮放大缩小
Window.MyMap.disableDragging();     //禁止拖拽
Window.MyMap.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开
setTimeout(function () {
    Window.MyMap.enableDragging();   //两秒后开启拖拽
    //map.enableInertialDragging();   //两秒后开启惯性拖拽
}, 2000);

//设置地图范围
var b = new BMap.Bounds(new BMap.Point(73.66, 3.86), new BMap.Point(135.05, 53.55));
try {
    BMapLib.AreaRestriction.setBounds(Window.MyMap, b);
} catch (e) {
    alert(e);
}


//给地图添加标注 并且给标注添加点击事件 显示这个位置的详情
function AddMarkerInMap(e) {
    ///创建标注加到图层
    var marker1 = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
    Window.MyMap.addOverlay(marker1); // 将标注添加到地图中

    var infoWindow1 = new BMap.InfoWindow("<p style='font-size:18px;'>哈哈，我是标注</p><p style='font-size:14px; color:red;'>赶快查看源代码，看看我是如何添加上来的！</p>");
    //给mark添加鼠标单击事件
    marker1.addEventListener("click", function() { this.openInfoWindow(infoWindow1); });
}

//.鼠标实时获取坐标
function GetlngAndlat(e) {
    if (e.point.lng != null) {
        G("").innerHTML = "当前坐标：" + e.point.lng + "," + e.point.lat;
    }
}

document.getElementById("ShowCityDivBtu").addEventListener("click", function () {
    showCityDiv();
});

document.getElementById("moreCityDiv_btu").addEventListener("click", function () {
    qurryCity();
});

document.getElementById("CloseSelectDivBtu").addEventListener("click", function () {
    showCityDiv();
});
//$("#id").根据ID获取标签
//根据城市选择地图中心
function selectCity(e) {  
    if (e != "") {
        try {
           // searchByStationName(e);
            Window.MyMap.setCenter(e);
            Window.MyMap.setZoom(12);
            changeVaule(e);
        } catch (e) {
            alert("选择城市出错");
        }
    } else {
        alert("想要去到的城市为空");
    }
}

//修改定位的城市名称
function changeVaule(e) {
    G("CurCityLabel").innerHTML = e;
    G("LocationCity").innerHTML = e;
    G("NewCityTXT").value = "";
    G("statusbar").innerHTML = "当前城市：" + e;
}


function searchByStationName(e) {
    var localSearch = new BMap.LocalSearch(Window.MyMap);
    localSearch.enableAutoViewport(); //允许自动调节窗体大小
        Window.MyMap.clearOverlays();//清空原来的标注
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            G("statusbar").innerHTML = "现在在" + poi.point.lng + "," + poi.point.lat;
            //这里可以状态栏显示
            Window.MyMap.centerAndZoom(poi.point, 13);
            var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
            Window.MyMap.addOverlay(marker);
            var content = e + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
            var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
            marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
             marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        });
        localSearch.search(e);
}




//显示城市选择对话框
 function showCityDiv() {
    //var div = $(".SelectCityDiv");
     var div = G("SelectCityDiv");
     var btu = G("ShowCityDivBtu");

    if (div.hidden == true) {
            btu.value = "↑";
        div.hidden = false;
    } else {
        btu.value = "↓";
        div.hidden = true;
    }
}


//确认城市选择
 function qurryCity() {
     var city = G("NewCityTXT");
     selectCity(city.value);
    showCityDiv();
}

 //3个控件 分别是定位 放大 缩小
  document.getElementById("ControlBox_Position_img").addEventListener("click", function() {
      getCurPosition();
  });
document.getElementById("ControlBox_Magnify_img").addEventListener("click", function() {
    setMagnify();
});
document.getElementById("ControlBox_Shrink_img").addEventListener("click", function () {
    setShrink();
});

//放大
function setMagnify() {
    Window.MyMap.setZoom(Window.MyMap.getZoom() + 1);
}

//缩小
function setShrink() {
    Window.MyMap.setZoom(Window.MyMap.getZoom() - 1);
}

 
//定位
function getCurPosition() {
    var geolocation = new BMap.Geolocation();
    var gc = new BMap.Geocoder();
    geolocation.getCurrentPosition(function(r) { //定位结果对象会传递给r变量  

            if (this.getStatus() == BMAP_STATUS_SUCCESS) { //通过Geolocation类的getStatus()可以判断是否成功定位。  
                var pt = r.point;
                if (mark_location != null) {
                    Window.MyMap.removeOverlay(mark_location);
                }
                mark_location = new BMap.Marker(pt);
                mark_location.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                Window.MyMap.addOverlay(mark_location); //添加图层
                Window.MyMap.panTo(pt);
                Window.MyMap.setCenter(pt);
                Window.MyMap.setZoom(18);
                gc.getLocation(pt, function(rs) {
                    var addComp = rs.addressComponents;
                    changeVaule(addComp.city);
                    //状态栏显示当前位置
                    G("statusbar").innerHTML = "当前位置是："+addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });
            } else {
                //关于状态码    
                //BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。    
                //BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。    
                //BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。    
                //BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。    
                //BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。    
                //BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。    
                //BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)    
                //BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)    
                //BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)    
                switch (this.getStatus()) {
                case 2:
                    alert('位置结果未知 获取位置失败.');
                    break;
                case 3:
                    alert('导航结果未知 获取位置失败..');
                    break;
                case 4:
                    alert('非法密钥 获取位置失败.');
                    break;
                case 5:
                    alert('对不起,非法请求位置  获取位置失败.');
                    break;
                case 6:
                    alert('对不起,当前 没有权限 获取位置失败.');
                    break;
                case 7:
                    alert('对不起,服务不可用 获取位置失败.');
                    break;
                case 8:
                    alert('对不起,请求超时 获取位置失败.');
                    break;

                }
            }

        },
        { enableHighAccuracy: true }
    );
}


//输入地址事件处理 start
var ac1 = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
            "input": "startPosition_txt",
            "location": Window.MyMap
        });
var ac2 = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
            "input": "endPosition_txt",
            "location": Window.MyMap
        });
//根据ID返回控件实例
function G(id) {
    return document.getElementById(id);
}
ac1.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
    dropItem_MouseOn(e);
});
ac2.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
    dropItem_MouseOn(e);
});
//鼠标放在下拉列表上的事件
function dropItem_MouseOn(e) {
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    G("searchResultPanel").innerHTML = str;
}

var myValue;
ac1.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
    dropItem_Click(e, ac1.oc.input);
});
ac2.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
    dropItem_Click(e, ac2.oc.input);
});

//鼠标点击下拉列表后的事件
function dropItem_Click(e,id) {
    var _value = e.item.value;
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
    setPlace(id);
}

//根据自己的选择添加覆盖标注
function setPlace(id) {
    //Window.MyMap.clearOverlays();    //清除地图上所有覆盖物
    if (id.indexOf("start") >= 0) {
        if (mark_startP != null) {
            Window.MyMap.removeOverlay(mark_startP); //清除地图上指定覆盖物
        }

        function myFun() {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            Window.MyMap.centerAndZoom(pp, 18);
            mark_startP = new BMap.Marker(pp);
            Window.MyMap.addOverlay(mark_startP); //添加标注
            mark_startP.enableDragging(); // 可拖拽
            //setBizValueForPoint(pp, mark_startP);
            //mark_startP.addEventListener("dragend", function(e) {
            //    setBizValueForPoint(e.point, mark_startP);
            //});
        }
    } else {
        if (mark_endP != null) {
            Window.MyMap.removeOverlay(mark_endP); //清除地图上指定覆盖物
        }
        function myFun() {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            Window.MyMap.centerAndZoom(pp, 18);
            mark_endP = new BMap.Marker(pp);
            Window.MyMap.addOverlay(mark_endP); //添加标注
            mark_endP.enableDragging(); // 可拖拽
            //setBizValueForPoint(pp, mark_endP);
            //mark_endP.addEventListener("dragend", function (e) {
            //    setBizValueForPoint(e.point, mark_endP);
            //});
        }
    }
   
    var local = new BMap.LocalSearch(Window.MyMap, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}


//输入地址事件处理 end



//业务方法 start
//根据事件，设置经纬度和地址

//根据事件，设置经纬度和地址
function setBizValueForPoint(point,mark) {
    var geoc = new BMap.Geocoder();
    geoc.getLocation(point, function (rs) {
        var addComp = rs.addressComponents;
       var addr = "地址:"+addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
        // 百度地图API功能
       var opts = {
           width: 200,     // 信息窗口宽度
           height: 100,     // 信息窗口高度
           title: function() {
               if (rs.surroundingPois.length == 0 || rs.surroundingPois[0] == "") {
                   return "地址：";
               } else {
                   return rs.surroundingPois[0].title;
               }
           },// 信息窗口标题
           enableMessage: true//设置允许信息窗发送短息
       }
       mark.addEventListener("click", function () {
           var infoWindow = new BMap.InfoWindow(addr, opts);  // 创建信息窗口对象 
            Window.MyMap.openInfoWindow(infoWindow, point); //开启信息窗口
        });
    });
}


//end

//驾车导航
$(".ul_car_li").click(function() {
    _navigationRoute(Window.MyMap, G("startPosition_txt").value, G("endPosition_txt").value, "car");
});
//document.getElementsByClassName("ul_car_li").addEventListener("click", function() {
//    _navigationRoute(Window.MyMap, G("startPosition_txt").value, G("endPosition_txt").value, "car");
//});
//步行导航
$(".ul_walk_li").click(function () {
    _navigationRoute(Window.MyMap, G("startPosition_txt").value, G("endPosition_txt").value, "walk");
});
//document.getElementsByClassName("ul_walk_li").addEventListener("click", function () {
//    _navigationRoute(Window.MyMap, G("startPosition_txt").value, G("endPosition_txt").value, "walk");
//});

//导航 map:本地实例化地图   startP：开始点  endP:结束点  type:驾车或者步行
function _navigationRoute(map, startP, endP, type) {
   
    var output = "";
    Window.MyMap.clearOverlays();    //清除地图上所有覆盖物
    //if (mk!=null) {
    //    Window.MyMap.addOverlay(mk);
    //}
    sendMsg(startP,endP);
    if (type == "car") {

        var transit = new BMap.DrivingRoute(map, {
            renderOptions: {
                map: map,
                panel: "navigation_result",
                enableDragging: true //起终点可进行拖拽
            },
            onSearchComplete: function (results) {
                if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                    return;
                }
                output = "驾车(从["+startP+"]到["+endP+"])：总用时为：";
                var plan = results.getPlan(0);
                output += plan.getDuration(true) + "\t";                //获取时间
                output += "总路程为：";
                output += plan.getDistance(true) + "\t";             //获取距离
            },
            policy: DrivingRouteSelect(),
            onPolylinesSet: function () {
                setTimeout(function () { G("statusbar").innerHTML = output }, "1000");
            }
        });
        transit.search(startP, endP);
    } else if (type == "walk") {
        var transit = new BMap.WalkingRoute(map, {
            renderOptions: {
                map: map,
                panel: "navigation_result",
                enableDragging: true //起终点可进行拖拽
            },
            onSearchComplete: function (results) {
                if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                    return;
                }
                output = "步行(从[" + startP + "]到[" + endP + "])：总用时为：";
                var plan = results.getPlan(0);
                output += plan.getDuration(true) + "\t";                //获取时间
                output += "总路程为：";
                output += plan.getDistance(true) + "\t";             //获取距离
            },
            onPolylinesSet: function () {
                setTimeout(function () { G("statusbar").innerHTML=output }, "1000");
            }
        });
        transit.search(startP, endP);
    }
    
}

//G("driving_way_select").addEventListener("click", function () {
//    DrivingRouteSelect();
//});
//驾车策略选择
//三种驾车策略：最少时间，最短距离，避开高速
G("driving_way_select").addEventListener("change",function() {
    DrivingRouteSelect();
});
    function DrivingRouteSelect() {
    var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
        var i = G("driving_way_select").value;
    return routePolicy[i];
}

    function getMsg() {
        $.ajax({
            type: "get",//数据发送的方式（post 或者 get）
            url: "MainForm.aspx",//要发送的后台地址
            data: { val1: r },//要发送的数据（参数）格式为{'val1':"1","val2":"2"}
            dataType: "json",//后台处理后返回的数据格式
            success: function (data) {//ajax请求成功后触发的方法
                
                alert('请求成功');
            },
            error: function (msg) {//ajax请求失败后触发的方法
                alert(msg + "失败");//弹出错误信息
            }
        });
    }

    function sendMsg(sp,ep) {
        $.ajax({
            type: "post",//数据发送的方式（post 或者 get）
            url: "MainForm.aspx",//要发送的后台地址
            data: { startP_: sp, endP_: ep},//要发送的数据（参数）格式为{'val1':"1","val2":"2"}
            dataType: "json"//后台处理后返回的数据格式
        });
    }

    //地址转坐标
    addrSearch=function (serachAddr,cellback) {
        //添加一个参数作为回调函数，该函数可以获取serachAddr参数 
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(serachAddr, function (point) {
           
            var addre = new BMap.Point(point.lng, point.lat);
           if (cellback) cellback(addre);//把addre传递到回调函数中，这样就可以在函数外部使用返回值了
        });
    }


//历史记录播放
    function _s(myP1, myP2) {
        Window.MyMap.clearOverlays();    //清除地图上所有覆盖物
        if (mark_location!=null) {
            Window.MyMap.addOverlay(mark_location);
        }
        var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/Mario.png", new BMap.Size(32, 70), {
            //小车图片
            //offset: new BMap.Size(0, -5),    //相当于CSS精灵
            imageOffset: new BMap.Size(0, 0) //图片的偏移量。为了是图片底部中心对准坐标点。
        });
        var driving2 = new BMap.DrivingRoute(Window.MyMap, { renderOptions: { map: Window.MyMap, autoViewport: true } }); //驾车实例
        driving2.search(myP1, myP2); //显示一条公交线路

        window.run = function () {
            var driving = new BMap.DrivingRoute(Window.MyMap); //驾车实例
            driving.search(myP1, myP2);
            driving.setSearchCompleteCallback(function () {
                var pts = driving.getResults().getPlan(0).getRoute(0).getPath(); //通过驾车实例，获得一系列点的数组
                var paths = pts.length; //获得有几个点

                var carMk = new BMap.Marker(pts[0], { icon: myIcon });
                Window.MyMap.addOverlay(carMk);
                i = 0;

                function resetMkPoint(i) {
                    carMk.setPosition(pts[i]);
                    if (i < paths) {
                        setTimeout(function () {
                            i++;
                            resetMkPoint(i);
                        }, 150);
                    }
                }

                setTimeout(function () {
                    resetMkPoint(5);
                }, 100);

            });
        }

        setTimeout(function () {
            run();
        }, 1500);
    }

    