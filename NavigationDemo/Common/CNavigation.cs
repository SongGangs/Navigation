using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NavigationDemo.common
{
    class CNavigation
    {
        private string m_startP = null;
        private string m_endP = null;
        private string m_recordTime =null;

        /// <summary>
        /// 起点
        /// </summary>
        public string startPosition
        {
            get {return this.m_startP; }
            set { m_startP = value; }
        }
        /// <summary>
        /// 终点
        /// </summary>
        public string endPosition
        {
            get { return this.m_endP; }
            set { m_endP = value; }
        }
        /// <summary>
        /// 记录时间
        /// </summary>
        public string recordTime
        {
            get { return this.m_recordTime; }
            set { m_recordTime = value; }
        }
    }
}
