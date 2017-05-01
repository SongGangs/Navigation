<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MainForm.aspx.cs" Inherits="NavigationDemo.MainForm" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="./CSS/MapCSS.css"/>
    <script>
        if (!navigator.onLine) {
            //无网络
            alert("抱歉，请先联网！否则不能正常使用");
            window.close();
            //执行离线状态时的任务
        }
    </script>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=134db1b9cf1f1f2b4427210932b34dcb"></script>
    <script type="text/javascript" src="./js/AreaRestriction_min.js"></script>
    <script type="text/javascript" src="./js/SearchInfoWindow.js"></script>
    <script type="text/javascript" src="./js/jquery-1.10.2.min.js"></script>
    <title>北斗杯比赛</title>
</head>
<body>
<form id="form1" runat="server">
    <div id="Contains">
        <div id="mapContain">
        </div>
        <div id="LocationDiv">
            <asp:Label runat="server" Text=" 乌鲁木齐市" ID="LocationCity"></asp:Label>
            <asp:Button id="ShowCityDivBtu" OnClientClick="return false" runat="server" Text="↓" />
            <div id="SelectCityDiv" hidden="true">
                <div style="width: 100%; height: 30px; line-height: 30px;border-bottom: 1px solid #DDD;">
                    当前城市：
                    <asp:Label runat="server" ID="CurCityLabel" Text=" 乌鲁木齐市"></asp:Label>
                    <asp:Button runat="server" OnClientClick="return false" ID="CloseSelectDivBtu" style="background: url(./Images/Message_Error.png) no-repeat 0 0;"/>
                </div>
                <div style="width: 100%; height: 30px; line-height: 30px; margin-top: 0px;">
                    城市名: &nbsp;
                    <asp:TextBox ID="NewCityTXT" runat="server"/>
                    <asp:Button runat="server" OnClientClick="return false" ID="moreCityDiv_btu" Text="0"/>
                </div>
                <div style="color: red; width: 100%; height: 20px; line-height: 20px; font-weight: bold; font-size: 15px;margin-top: 0px;">&nbsp;提示：只限最底定位到县城</div>
            </div>
        </div>
        <div id="ControlBox">
            <div class="ControlBox_div" id="ControlBox_Position">
                <img class="ControlBox_img" id="ControlBox_Position_img" src="Images/location.png"/>
            </div>
            <div class="ControlBox_div" id="ControlBox_Magnify">
                <img class="ControlBox_img" id="ControlBox_Magnify_img" src="Images/plus.png"/>
            </div>
            <div class="ControlBox_div" id="ControlBox_Shrink">
                <img class="ControlBox_img" id="ControlBox_Shrink_img" src="Images/minus.png"/>
            </div>
        </div>
        <div id="statusbar">
            我是来测试状态栏的
        </div>

        <div id="Menu_all">
            <ul role="list" style="width: 328px; height: 30px; line-height: 30px; margin: 0; padding: 0; position: absolute; font-family: 微软雅黑, Microsoft Yahei, Microsoft Sans Serif;">
                <li id="NavigationLi" role="listitem">导航</li>
                <li id="RecordLi" role="listitem">导航记录</li>
            </ul>
            <%--<input id="Menu_btu" type="button" value="<"/>--%>

            <div id="NavigationMenu" style="font-family: 微软雅黑, Microsoft Yahei, Microsoft Sans Serif;">
                <table>
                    <tr style="height: 30px;">
                        <td colspan="2">
                            <span style="margin-left: 40px;">导航</span></td>
                    </tr>
                    <tr style="height: 30px;">
                        <td class="tr_td_label">请输入起点：</td>
                        <td class="tr_td_text">
                            <input type="text" id="startPosition_txt" runat="server" placeholder="请输入地址" />
                        </td>
                    </tr>
                    <tr style="height: 30px;">
                        <td class="tr_td_label">请输入终点：</td>
                        <td class="tr_td_text">
                            <input type="text" id="endPosition_txt" runat="server" placeholder="请输入地址" />
                        </td>
                    </tr>
                    <%--<tr style="height: 30px;">
                        <td colspan="2">
                            <asp:Button runat="server" OnClick="Navigation_Onclick" Text="导航" style="width: 100px; margin-left: 70px;" ID="GuideBtu"/>
                        </td>
                    </tr>--%>
                    <tr style="height: 30px;">
                        <td colspan="2">
                            <ul role="list"  style="width: 142px; height: 30px; padding: 0; line-height: 30px; margin: 0 auto;">
                                <li class="ul_car_li" role="listitem" style="width: 40px; list-style: none; float: left; cursor: pointer; text-align: center;">驾车</li>
                                <li class="ul_car_li" role="listitem" style="width: 30px; list-style: none; float: left; cursor: pointer; text-align: center;">
                                    <img style="background-repeat: no-repeat;height: 100%; width: 100%;" src="Images/1.jpg"/>
                                </li>
                                <li class="ul_walk_li" role="listitem" style="width: 40px; list-style: none; float: left; cursor: pointer; border-left: 2px solid; text-align: center;" >步行</li>
                                <li class="ul_walk_li" role="listitem" style="width: 30px; list-style: none; float: left; cursor: pointer; text-align: center;" >
                                    <img style="background-repeat: no-repeat;height: 100%; width: 100%;"  src="Images/2.jpg"/>
                                </li>
                            </ul>
                            <select hidden="true" id="driving_way_select" style=" width: 80px; margin-top: -24px; position: absolute; height: 20px; float: left; margin-left: 10px;">
                                <option value="0">最少时间</option>
                                <option value="1">最短距离</option>
                                <option value="2">避开高速</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div id="navigation_result" style="height: 440px; overflow-y: auto; overflow-x: hidden"></div>
            </div>
            <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
            <div id="RecordMenu" hidden="true">
                <ul  title="导航记录">
                </ul>
            </div>
        </div>
    </div>

</form>
     <%--JS的解译顺序是根据HTML的顺序走的--%>
    <script type="text/javascript" >
        
        //定义一个全局变量 便于方法写在JS文件中
        Window.MyMap = new BMap.Map("mapContain", { enableMapClick: false });//构造底图时，关闭底图可点功能
    </script>
    <script type="text/javascript" src="./js/MapHelper.js"></script>
    


    <script type="text/javascript">
        var navigation = document.getElementById('NavigationLi');
        navigation.addEventListener("mouseover", function () {
            var navigationMenu = document.getElementById('NavigationMenu');
            var recordMenu = document.getElementById('RecordMenu');
            if (navigationMenu.hidden == true) {
                recordMenu.hidden = true;
                navigationMenu.hidden = false;
                navigation.style.background = "#fff";
                document.getElementById('RecordLi').style.background = "#eee";
            }
        });

        var record = document.getElementById('RecordLi');
        record.addEventListener("mouseover", function () {
            var navigationMenu = document.getElementById('NavigationMenu');
            var recordMenu = document.getElementById('RecordMenu');
            if (recordMenu.hidden == true) {
                navigationMenu.hidden = true;
                recordMenu.hidden = false;
                record.style.background = "#fff";
                document.getElementById('NavigationLi').style.background = "#eee";
            }
        });

      

        
        <%--加载导航历史记录--%>
        var a = "<%=readFile()%>";//JavaScript中调用C#后台的函数
        list = a.split(';');
        for (var i = 0; i < list.length-1; i++) {
            $("#RecordMenu ul").append("<li> <p id='tb_" + i + "' class='normaltab' >" + list[i] + "</p></li>");
        }
      
        $("#RecordMenu ul li").click(function (e) {
            var s = e.currentTarget.innerHTML;
            var t = e.currentTarget.innerText;
            var sp = s.substring(s.indexOf("\t") + 1, s.indexOf("-"));
            var ep = t.substring(t.indexOf(">") + 1);
            var myGeo = new BMap.Geocoder();
            var myP1 = new BMap.Point(116.380967, 39.913285);    //起点
            var myP2 = new BMap.Point(116.424374, 39.914668);    //终点
            myGeo.getPoint(sp, function (point) {
                myP1 = new BMap.Point(point.lng, point.lat);
                //alert(point.lng + "," + point.lat);
            });
            myGeo.getPoint(ep, function (point) {
                myP2 = new BMap.Point(point.lng, point.lat);
                //alert(point.lng + "," + point.lat);
            });
            //这里让函数先执行1S 等待地址转换出来
            setTimeout(function() {
                _s(myP1, myP2);
                G("statusbar").innerHTML = "记录回放：\t" + t.toString();
            }, 1000);

        });
       
      
    </script>
    
</body>
</html>
