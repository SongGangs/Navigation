using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Timers;
using System.Web;
using System.Web.Services;
using System.Web.UI.WebControls;
using Insus.NET;
using NavigationDemo.common;

namespace NavigationDemo
{
    public partial class MainForm : System.Web.UI.Page
    {
        private string FileName = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "\\NavigationHistroy.txt";
        private List<CNavigation>Nlist=new List<CNavigation>();
        private JavascriptUtility js = new JavascriptUtility();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
               // readFile();
                try{
                string stantPoint = HttpContext.Current.Request["startP_"].ToString();
                string endPoint = HttpContext.Current.Request["endP_"].ToString();
                getDataForHttp(stantPoint, endPoint);
                 }
            catch (Exception w)
            {

            }
            }
        }

        /// <summary>
        /// 导航
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Navigation_Onclick(object sender, EventArgs e)
        {
            //string startPosition = Request.Form[StartPosition_txt.UniqueID];
            //string endPosition = Request.Form[EndPosition_txt.UniqueID];
            string startPosition = "1";
            string endPosition = "2";
            DataSet ds = Database.RunDataSet("select * from Route");
            DataTable dt = ds.Tables[0];
            DataRow newdr = dt.NewRow();
            newdr["RouteID"] = 0;
            newdr["StartPoint"] = startPosition;
            newdr["EndPoint"] = endPosition;
            dt.Rows.Add(newdr);
            try
            {
                int k = Database.update("Route", "RouteID", dt);
                UpdateData(k, 10, 10);
            }
            catch (Exception ex)
            {
                string message = "正在处理您的请求.";
                DisplayAlert(message);
            }

        }

        /// <summary>
        /// 用的定时器实时更新数据
        /// </summary>
        /// <param name="k"></param>
        /// <param name="x"></param>
        /// <param name="y"></param>
        private void UpdateData(int k, float x, float y)
        {
            Timer t = new Timer();
            t.Elapsed += (sender, e) =>
            {
                DataSet ds = Database.RunDataSet("select * from Recorder");
                DataTable dt = ds.Tables[0];
                DataRow newdr = dt.NewRow();
                newdr["RecorderID"] = 0;
                newdr["RouteID"] = k;
                newdr["RecorderTime"] = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                newdr["RecorderX"] = x;
                newdr["RecorderY"] = y;
                dt.Rows.Add(newdr);
                try
                {
                    int j = Database.update("Recorder", "RecorderID", dt);
                }
                catch (Exception ex)
                {
                    string message = "数据记录错误";
                    DisplayAlert(message);
                }
            };
            t.Interval = 1000;
            t.Enabled = true;



        }

        /// <summary>
        /// 让前台弹出对话框
        /// </summary>
        /// <param name="message"></param>
        private void DisplayAlert(string message)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("alert('");
            sb.Append(message);
            sb.Append("');");
            js.RunJavaScript(sb.ToString());
        }

        private void getDataForHttp(string stantPoint, string endPoint)
        {
            
                CNavigation navigation=new CNavigation();
                navigation.startPosition = stantPoint;
                navigation.endPosition = endPoint;
                navigation.recordTime=DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
                writeFile(navigation);
           
        }
        /// <summary>
        /// 以字符串的形式返回到前端
        /// </summary>
        /// <returns></returns>
        public string readFile()
        {
            CNavigation navigation = new CNavigation();
            FileStream fs = new FileStream(FileName, FileMode.OpenOrCreate, FileAccess.Read);
            StreamReader sr = new StreamReader(fs, Encoding.UTF8);

            string content = sr.ReadLine();
            while (!string.IsNullOrEmpty(content))
            {
                try
                {
                    navigation = new CNavigation();
                    navigation.startPosition = content.Substring(content.IndexOf("起点:") + 3, content.IndexOf("终点:") - 3).Trim();
                    navigation.endPosition = content.Substring(content.IndexOf("终点:") + 3, (content.IndexOf("记录时间:") - content.IndexOf("终点:") - 3)).Trim();
                    navigation.recordTime = content.Substring(content.IndexOf("记录时间:")+5).Trim();
                    Nlist.Add(navigation);
                }
                catch (Exception)
                {
                }
                finally
                {
                    content = sr.ReadLine();
                }
            }
            fs.Close();
            sr.Close();
            string result="";
            foreach (var n in Nlist)
            {
                result = result + n.recordTime + "\t" + n.startPosition + "--->" + n.endPosition + ";";
            }
            return result;
        }

        private void writeFile(CNavigation cn)
        {
            StreamWriter sw = new StreamWriter(FileName, true);
            string r = "起点:"+cn.startPosition+"\t终点:"+cn.endPosition+"\t记录时间:"+cn.recordTime;
            sw.WriteLine(r);
            sw.Close();
        }
    }
}